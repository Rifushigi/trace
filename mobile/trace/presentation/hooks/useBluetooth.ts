import { useState, useEffect, useCallback } from 'react';
import { BleManager, State } from 'react-native-ble-plx';
import { Alert, Platform } from 'react-native';

let bleManagerInstance: BleManager | null = null;

const getBleManager = () => {
    if (!bleManagerInstance) {
        bleManagerInstance = new BleManager();
    }
    return bleManagerInstance;
};

export const useBluetooth = () => {
    const [bluetoothStatus, setBluetoothStatus] = useState<'checking' | 'granted' | 'denied'>('checking');
    const [isScanning, setIsScanning] = useState(false);
    const [nearbyBeacons, setNearbyBeacons] = useState<any[]>([]);
    const [bleManager, setBleManager] = useState<BleManager | null>(null);

    useEffect(() => {
        const initBleManager = async () => {
            try {
                const manager = getBleManager();
                setBleManager(manager);

                // Check if Bluetooth is powered on
                const state = await manager.state();
                if (state === State.PoweredOn) {
                    setBluetoothStatus('granted');
                } else {
                    setBluetoothStatus('denied');
                }

                // Listen for state changes
                const subscription = manager.onStateChange((state) => {
                    if (state === State.PoweredOn) {
                        setBluetoothStatus('granted');
                    } else {
                        setBluetoothStatus('denied');
                    }
                });

                return () => {
                    subscription.remove();
                };
            } catch (error) {
                console.error('Error initializing BLE manager:', error);
                setBluetoothStatus('denied');
            }
        };

        initBleManager();
    }, []);

    const requestBluetoothPermissions = useCallback(async () => {
        try {
            if (!bleManager) {
                throw new Error('BLE Manager not initialized');
            }

            // For Android, we need to request location permissions
            if (Platform.OS === 'android') {
                // TODO: Implement proper permission requesting
                setBluetoothStatus('granted');
            } else {
                // For iOS, we just need to check if Bluetooth is powered on
                const state = await bleManager.state();
                if (state === State.PoweredOn) {
                    setBluetoothStatus('granted');
                } else {
                    setBluetoothStatus('denied');
                }
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
            Alert.alert('Error', 'Failed to request Bluetooth permissions');
            setBluetoothStatus('denied');
        }
    }, [bleManager]);

    const startScanning = useCallback(async () => {
        if (!bleManager) {
            Alert.alert('Error', 'Bluetooth is not initialized');
            return;
        }

        if (bluetoothStatus !== 'granted') {
            Alert.alert('Permission Required', 'Please grant Bluetooth permissions to scan for beacons');
            return;
        }

        setIsScanning(true);
        try {
            bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.error('Scan error:', error);
                    return;
                }
                if (device) {
                    setNearbyBeacons(prev => {
                        const exists = prev.some(d => d.id === device.id);
                        if (!exists) {
                            return [...prev, device];
                        }
                        return prev;
                    });
                }
            });
        } catch (error) {
            console.error('Error starting scan:', error);
            Alert.alert('Error', 'Failed to start scanning for beacons');
            setIsScanning(false);
        }
    }, [bleManager, bluetoothStatus]);

    const stopScanning = useCallback(() => {
        if (!bleManager) return;

        setIsScanning(false);
        bleManager.stopDeviceScan();
    }, [bleManager]);

    const connectToBeacon = useCallback(async (deviceId: string) => {
        if (!bleManager) {
            throw new Error('Bluetooth is not initialized');
        }

        try {
            const device = await bleManager.connectToDevice(deviceId);
            Alert.alert('Success', 'Connected to beacon successfully');
            return device;
        } catch (error) {
            console.error('Error connecting to device:', error);
            Alert.alert('Error', 'Failed to connect to beacon');
            throw error;
        }
    }, [bleManager]);

    return {
        bluetoothStatus,
        isScanning,
        nearbyBeacons,
        requestBluetoothPermissions,
        startScanning,
        stopScanning,
        connectToBeacon,
    };
}; 