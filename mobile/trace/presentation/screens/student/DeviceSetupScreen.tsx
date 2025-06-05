import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { useBluetooth } from '../../hooks/useBluetooth';
import { useLocation } from '../../hooks/useLocation';
import { useNFC } from '../../hooks/useNFC';
import { useFaceRecognition } from '../../hooks/useFaceRecognition';
import { MaterialIcons } from '@expo/vector-icons';

export const DeviceSetupScreen = observer(() => {
    const {
        bluetoothStatus,
        isScanning,
        nearbyBeacons,
        requestBluetoothPermissions,
        startScanning,
        stopScanning,
        connectToBeacon,
    } = useBluetooth();

    const {
        location,
        error: locationError,
        isLoading: isLocationLoading,
        permissionStatus: locationPermissionStatus,
        requestPermission: requestLocationPermission,
        getCurrentLocation,
    } = useLocation();

    const {
        status: nfcStatus,
        isAvailable: isNFCAvailable,
        requestPermission: requestNfcPermissions,
    } = useNFC();

    const {
        status: faceRecognitionStatus,
        isAvailable: isFaceRecognitionAvailable,
        isEnrolled,
        requestPermission: requestFaceRecognitionPermissions,
        verifyFace,
    } = useFaceRecognition();

    return (
        <ScrollView style={styles.container}>
            {/* Bluetooth Status */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="bluetooth" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Bluetooth Status</Text>
                </View>
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

            {/* NFC Status */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="nfc" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>NFC Status</Text>
                </View>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, nfcStatus === 'granted' ? styles.statusActive : styles.statusInactive]} />
                    <Text style={styles.statusText}>
                        {nfcStatus === 'checking' ? 'Checking...' :
                         nfcStatus === 'granted' ? 'NFC Access Granted' :
                         nfcStatus === 'unavailable' ? 'NFC Not Available' :
                         'NFC Access Required'}
                    </Text>
                </View>
                {nfcStatus === 'denied' && isNFCAvailable && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={requestNfcPermissions}
                    >
                        <Text style={styles.actionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                )}
            </Card>

            {/* Face Recognition Status */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="face" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Face Recognition Status</Text>
                </View>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, faceRecognitionStatus === 'granted' ? styles.statusActive : styles.statusInactive]} />
                    <Text style={styles.statusText}>
                        {faceRecognitionStatus === 'checking' ? 'Checking...' :
                         faceRecognitionStatus === 'granted' ? 'Face Recognition Access Granted' :
                         faceRecognitionStatus === 'unavailable' ? 'Face Recognition Not Available' :
                         'Face Recognition Access Required'}
                    </Text>
                </View>
                {faceRecognitionStatus === 'denied' && isFaceRecognitionAvailable && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={requestFaceRecognitionPermissions}
                    >
                        <Text style={styles.actionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                )}
                {faceRecognitionStatus === 'granted' && !isEnrolled && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={verifyFace}
                    >
                        <Text style={styles.actionButtonText}>Register Face</Text>
                    </TouchableOpacity>
                )}
            </Card>

            {/* Location Status */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="location-on" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Location Status</Text>
                </View>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, locationPermissionStatus === 'granted' ? styles.statusActive : styles.statusInactive]} />
                    <Text style={styles.statusText}>
                        {locationPermissionStatus === 'granted' ? 'Location Access Granted' :
                         locationPermissionStatus === 'denied' ? 'Location Access Required' :
                         'Checking Location Access...'}
                    </Text>
                </View>
                {locationPermissionStatus !== 'granted' && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={requestLocationPermission}
                    >
                        <Text style={styles.actionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                )}
                {locationPermissionStatus === 'granted' && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={getCurrentLocation}
                    >
                        <Text style={styles.actionButtonText}>Update Location</Text>
                    </TouchableOpacity>
                )}
            </Card>

            {/* Beacon Scanner */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="bluetooth-searching" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Nearby Beacons</Text>
                </View>
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
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="info" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Instructions</Text>
                </View>
                <Text style={styles.instructionText}>
                    1. Grant all required permissions (Bluetooth, NFC, Face Recognition, Location){'\n'}
                    2. Start scanning for nearby beacons{'\n'}
                    3. Select your classroom&apos;s beacon from the list{'\n'}
                    4. Wait for successful connection confirmation{'\n'}
                    5. Ensure your face is registered for attendance{'\n'}
                    6. Verify your location is being tracked correctly
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 8,
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

export default DeviceSetupScreen; 