import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { BLEManager } from './services/ble_manager';
import { NFCManager } from './services/nfc_manager';
import { GeofenceManager } from './services/geofence_manager';
import { DeviceManager } from './services/device_manager';
import { logger } from './utils/logger';
import { config } from './config';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST']
    }
});

// Initialize managers
const bleManager = new BLEManager();
const nfcManager = new NFCManager();
const geofenceManager = new GeofenceManager();
const deviceManager = new DeviceManager();

// Socket.IO connection handling
io.on('connection', (socket) => {
    logger.info('New client connected');

    // Handle BLE device scanning
    socket.on('start:ble_scan', async () => {
        try {
            await bleManager.startScanning();
            socket.emit('ble:scanning_started');
        } catch (error) {
            logger.error('BLE scan start failed:', error);
            socket.emit('error', 'Failed to start BLE scanning');
        }
    });

    socket.on('stop:ble_scan', async () => {
        try {
            await bleManager.stopScanning();
            socket.emit('ble:scanning_stopped');
        } catch (error) {
            logger.error('BLE scan stop failed:', error);
            socket.emit('error', 'Failed to stop BLE scanning');
        }
    });

    // Handle NFC reader
    socket.on('start:nfc_reader', async () => {
        try {
            await nfcManager.startReading();
            socket.emit('nfc:reading_started');
        } catch (error) {
            logger.error('NFC reader start failed:', error);
            socket.emit('error', 'Failed to start NFC reader');
        }
    });

    socket.on('stop:nfc_reader', async () => {
        try {
            await nfcManager.stopReading();
            socket.emit('nfc:reading_stopped');
        } catch (error) {
            logger.error('NFC reader stop failed:', error);
            socket.emit('error', 'Failed to stop NFC reader');
        }
    });

    // Handle geofencing
    socket.on('set:geofence', async (data) => {
        try {
            await geofenceManager.setGeofence(data);
            socket.emit('geofence:set');
        } catch (error) {
            logger.error('Geofence set failed:', error);
            socket.emit('error', 'Failed to set geofence');
        }
    });

    // Handle device registration
    socket.on('register:device', async (data) => {
        try {
            const device = await deviceManager.registerDevice(data);
            socket.emit('device:registered', device);
        } catch (error) {
            logger.error('Device registration failed:', error);
            socket.emit('error', 'Failed to register device');
        }
    });

    // Handle device status updates
    socket.on('update:device_status', async (data) => {
        try {
            const device = await deviceManager.updateDeviceStatus(data);
            socket.emit('device:status_updated', device);
        } catch (error) {
            logger.error('Device status update failed:', error);
            socket.emit('error', 'Failed to update device status');
        }
    });

    socket.on('disconnect', () => {
        logger.info('Client disconnected');
    });
});

// Event handlers for device events
bleManager.on('deviceFound', (device) => {
    io.emit('ble:device_found', device);
});

nfcManager.on('cardDetected', (card) => {
    io.emit('nfc:card_detected', card);
});

geofenceManager.on('locationUpdate', (location) => {
    io.emit('geofence:location_update', location);
});

// Start the server
const PORT = config.SERVER_PORT || 5001;
httpServer.listen(PORT, () => {
    logger.info(`IoT Bridge service running on port ${PORT}`);
}); 