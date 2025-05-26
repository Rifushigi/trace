import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { StudentStackScreenProps } from '../../../navigation/types';
import { Student } from '../../../domain/entities/User';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { BleManager } from 'react-native-ble-plx';

type Props = StudentStackScreenProps<'DeviceSetup'>;

const bleManager = new BleManager();

export const DeviceSetupScreen = observer(({ navigation }: Props) => {
    const { authStore } = useStores();
    const user = authStore.authState.user as Student;
    const [bluetoothStatus, setBluetoothStatus] = useState<'checking' | 'granted' | 'denied'>('checking');
    const [isScanning, setIsScanning] = useState(false);
    const [nearbyBeacons, setNearbyBeacons] = useState<any[]>([]);

    useEffect(() => {
        checkBluetoothPermissions();
        return () => {
            bleManager.destroy();
        };
    }, []);

    const checkBluetoothPermissions = async () => {
        try {
            if (Platform.OS === 'ios') {
                const result = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
                if (result === RESULTS.GRANTED) {
                    setBluetoothStatus('granted');
                } else if (result === RESULTS.DENIED) {
                    setBluetoothStatus('denied');
                }
            } else {
                const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                if (result === RESULTS.GRANTED) {
                    setBluetoothStatus('granted');
                } else if (result === RESULTS.DENIED) {
                    setBluetoothStatus('denied');
                }
            }
        } catch (error) {
            console.error('Error checking permissions:', error);
            setBluetoothStatus('denied');
        }
    };

    const requestBluetoothPermissions = async () => {
        try {
            if (Platform.OS === 'ios') {
                const result = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
                if (result === RESULTS.GRANTED) {
                    setBluetoothStatus('granted');
                }
            } else {
                const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                if (result === RESULTS.GRANTED) {
                    setBluetoothStatus('granted');
                }
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
            Alert.alert('Error', 'Failed to request Bluetooth permissions');
        }
    };

    const startScanning = async () => {
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
        }
    };

    const stopScanning = () => {
        setIsScanning(false);
        bleManager.stopDeviceScan();
    };

    const connectToBeacon = async (deviceId: string) => {
        try {
            const device = await bleManager.connectToDevice(deviceId);
            Alert.alert('Success', 'Connected to beacon successfully');
            // TODO: Update user's beacon ID in the backend
        } catch (error) {
            console.error('Error connecting to device:', error);
            Alert.alert('Error', 'Failed to connect to beacon');
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Bluetooth Status */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Bluetooth Status</Text>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, bluetoothStatus === 'granted' ? styles.statusActive : styles.statusInactive]} />
                    <Text style={styles.statusText}>
                        {bluetoothStatus === 'checking' ? 'Checking...' :
                         bluetoothStatus === 'granted' ? 'Bluetooth Access Granted' :
                         'Bluetooth Access Required'}
                    </Text>
                </View>
                {bluetoothStatus === 'denied' && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={requestBluetoothPermissions}
                    >
                        <Text style={styles.actionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                )}
            </Card>

            {/* Beacon Scanner */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Nearby Beacons</Text>
                {isScanning ? (
                    <>
                        <Text style={styles.scanningText}>Scanning for beacons...</Text>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={stopScanning}
                        >
                            <Text style={styles.actionButtonText}>Stop Scanning</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={startScanning}
                    >
                        <Text style={styles.actionButtonText}>Start Scanning</Text>
                    </TouchableOpacity>
                )}

                {nearbyBeacons.length > 0 && (
                    <View style={styles.beaconList}>
                        {nearbyBeacons.map(beacon => (
                            <TouchableOpacity
                                key={beacon.id}
                                style={styles.beaconItem}
                                onPress={() => connectToBeacon(beacon.id)}
                            >
                                <Text style={styles.beaconName}>{beacon.name || 'Unknown Beacon'}</Text>
                                <Text style={styles.beaconId}>ID: {beacon.id}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </Card>

            {/* Instructions */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                <Text style={styles.instructionText}>
                    1. Grant Bluetooth permissions if not already granted{'\n'}
                    2. Start scanning for nearby beacons{'\n'}
                    3. Select your classroom's beacon from the list{'\n'}
                    4. Wait for successful connection confirmation
                </Text>
            </Card>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    section: {
        margin: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusActive: {
        backgroundColor: colors.success,
    },
    statusInactive: {
        backgroundColor: colors.error,
    },
    statusText: {
        fontSize: 16,
        color: colors.text,
    },
    actionButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    scanningText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    beaconList: {
        marginTop: 16,
    },
    beaconItem: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    beaconName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    beaconId: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    instructionText: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
}); 