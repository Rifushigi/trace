export interface BLEDevice {
    id: string;
    name: string;
    rssi: number;
    classId: string;
    lastSeen: Date;
}

export interface NFCCard {
    id: string;
    uid: string;
    studentId: string;
    lastUsed: Date;
}

export interface BiometricDevice {
    id: string;
    name: string;
    type: 'fingerprint' | 'facial' | 'iris';
    status: 'active' | 'inactive' | 'error';
    lastUsed: Date;
}

export interface IoTDevice {
    id: string;
    type: 'ble' | 'nfc' | 'biometric';
    name: string;
    status: 'active' | 'inactive' | 'error';
    lastSeen: Date;
    metadata?: Record<string, any>;
} 