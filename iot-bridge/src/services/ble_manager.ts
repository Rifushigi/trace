import { EventEmitter } from 'events';
import noble, { Peripheral } from 'noble';
import { logger } from '../utils/logger';
import { config } from '../config';
import { BLEDevice } from '../types/iot';

interface BLEDeviceAdvertisement {
    localName?: string;
    serviceData?: Array<{ uuid: string; data: Buffer }>;
    manufacturerData?: Buffer;
}

interface BLEDeviceWithAdvertisement extends BLEDevice {
    advertisement: BLEDeviceAdvertisement;
}

export class BLEManager extends EventEmitter {
    private isScanning: boolean = false;
    private knownDevices: Map<string, BLEDeviceWithAdvertisement> = new Map();
    private discoveredPeripherals: Peripheral[] = [];

    constructor() {
        super();
        this.setupNoble();
    }

    private setupNoble() {
        noble.on('stateChange', (state) => {
            if (state === 'poweredOn') {
                logger.info('BLE adapter powered on');
            } else {
                logger.warn(`BLE adapter state changed to ${state}`);
            }
        });

        noble.on('discover', (peripheral) => {
            this.discoveredPeripherals.push(peripheral);
            const device: BLEDeviceWithAdvertisement = {
                id: peripheral.id,
                name: peripheral.advertisement.localName || 'Unknown',
                rssi: peripheral.rssi,
                classId: config.DEFAULT_CLASS_ID,
                lastSeen: new Date(),
                advertisement: {
                    localName: peripheral.advertisement.localName,
                    serviceData: peripheral.advertisement.serviceData,
                    manufacturerData: peripheral.advertisement.manufacturerData
                }
            };

            this.knownDevices.set(peripheral.id, device);
            this.emit('deviceFound', device);
        });
    }

    async startScanning(): Promise<void> {
        if (this.isScanning) {
            return;
        }

        try {
            await new Promise<void>((resolve, reject) => {
                noble.startScanning([], true, (error: string | null) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve();
                    }
                });
            });

            this.isScanning = true;
            logger.info('BLE scanning started');
        } catch (error) {
            logger.error('Failed to start BLE scanning:', error);
            throw error;
        }
    }

    async stopScanning(): Promise<void> {
        if (!this.isScanning) {
            return;
        }

        try {
            await new Promise<void>((resolve) => {
                noble.stopScanning(() => resolve());
            });

            this.isScanning = false;
            logger.info('BLE scanning stopped');
        } catch (error) {
            logger.error('Failed to stop BLE scanning:', error);
            throw error;
        }
    }

    async connectToDevice(deviceId: string): Promise<void> {
        try {
            const peripheral = this.discoveredPeripherals.find(p => p.id === deviceId);
            if (!peripheral) {
                throw new Error('Device not found');
            }

            await new Promise<void>((resolve, reject) => {
                peripheral.connect((error: string | null) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve();
                    }
                });
            });

            logger.info(`Connected to BLE device: ${deviceId}`);
        } catch (error) {
            logger.error(`Failed to connect to BLE device ${deviceId}:`, error);
            throw error;
        }
    }

    async disconnectFromDevice(deviceId: string): Promise<void> {
        try {
            const peripheral = this.discoveredPeripherals.find(p => p.id === deviceId);
            if (!peripheral) {
                throw new Error('Device not found');
            }

            await new Promise<void>((resolve, reject) => {
                peripheral.disconnect((error: string | null) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve();
                    }
                });
            });

            logger.info(`Disconnected from BLE device: ${deviceId}`);
        } catch (error) {
            logger.error(`Failed to disconnect from BLE device ${deviceId}:`, error);
            throw error;
        }
    }

    getKnownDevices(): BLEDevice[] {
        return Array.from(this.knownDevices.values());
    }

    getDeviceById(deviceId: string): BLEDevice | undefined {
        return this.knownDevices.get(deviceId);
    }
} 