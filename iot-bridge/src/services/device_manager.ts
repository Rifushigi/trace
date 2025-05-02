import { EventEmitter } from 'events';
import { IoTDevice } from '../types/iot';
import { logger } from '../utils/logger';

export class DeviceManager extends EventEmitter {
    private devices: Map<string, IoTDevice> = new Map();

    async registerDevice(device: IoTDevice): Promise<IoTDevice> {
        this.devices.set(device.id, device);
        logger.info(`Device registered: ${device.id}`);
        return device;
    }

    async updateDeviceStatus(data: { id: string; status: IoTDevice['status'] }): Promise<IoTDevice> {
        const device = this.devices.get(data.id);
        if (!device) {
            throw new Error('Device not found');
        }
        device.status = data.status;
        device.lastSeen = new Date();
        this.devices.set(device.id, device);
        logger.info(`Device status updated: ${device.id}`);
        return device;
    }

    getDeviceById(id: string): IoTDevice | undefined {
        return this.devices.get(id);
    }

    getAllDevices(): IoTDevice[] {
        return Array.from(this.devices.values());
    }
} 