import { EventEmitter } from 'events';

declare module 'noble' {
    export interface Advertisement {
        localName?: string;
        txPowerLevel?: number;
        manufacturerData?: Buffer;
        serviceData?: Array<{
            uuid: string;
            data: Buffer;
        }>;
        serviceUuids?: string[];
    }

    export interface Peripheral extends EventEmitter {
        id: string;
        uuid: string;
        address: string;
        addressType: string;
        connectable: boolean;
        advertisement: Advertisement;
        rssi: number;
        services: any[];
        state: string;

        connect(callback: (error: string | null) => void): void;
        disconnect(callback: (error: string | null) => void): void;
    }

    const noble: {
        startScanning(serviceUUIDs?: string[], allowDuplicates?: boolean, callback?: (error: string | null) => void): void;
        stopScanning(callback?: () => void): void;
        on(event: 'stateChange', listener: (state: string) => void): void;
        on(event: 'discover', listener: (peripheral: Peripheral) => void): void;
    };

    export default noble;
} 