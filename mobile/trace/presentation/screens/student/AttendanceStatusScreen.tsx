import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { router } from 'expo-router';

export const AttendanceStatusScreen = observer(() => {
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState({
        faceRecognition: false,
        ble: false,
        location: false,
    });

    useEffect(() => {
        // TODO: Implement real-time status monitoring
        const checkStatus = async () => {
            try {
                // Simulate status check
                await new Promise(resolve => setTimeout(resolve, 2000));
                setStatus({
                    faceRecognition: true,
                    ble: true,
                    location: false,
                });
            } catch (error) {
                console.error('Error checking status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();
    }, []);

    const getStatusColor = (isActive: boolean) => {
        return isActive ? colors.success : colors.error;
    };

    const getStatusText = (isActive: boolean) => {
        return isActive ? 'Connected' : 'Not Connected';
    };

    const getTroubleshootingTips = (type: keyof typeof status) => {
        const tips = {
            faceRecognition: [
                'Ensure your face is clearly visible',
                'Check if you have granted camera permissions',
                'Try adjusting your position or lighting',
            ],
            ble: [
                'Enable Bluetooth in your device settings',
                'Move closer to the BLE beacon',
                'Restart Bluetooth if connection issues persist',
            ],
            location: [
                'Enable location services in your device settings',
                'Check if you are within the designated area',
                'Try refreshing your location',
            ],
        };
        return tips[type];
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Checking status...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.subtitle}>Real-time verification status</Text>
            </View>

            {/* Status Indicators */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Verification Status</Text>
                {Object.entries(status).map(([key, value]) => (
                    <View key={key} style={styles.statusItem}>
                        <View style={styles.statusHeader}>
                            <Text style={styles.statusLabel}>
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </Text>
                            <View style={styles.statusIndicator}>
                                <View
                                    style={[
                                        styles.statusDot,
                                        { backgroundColor: getStatusColor(value) },
                                    ]}
                                />
                                <Text style={[styles.statusText, { color: getStatusColor(value) }]}>
                                    {getStatusText(value)}
                                </Text>
                            </View>
                        </View>
                        {!value && (
                            <View style={styles.troubleshootingContainer}>
                                <Text style={styles.troubleshootingTitle}>Troubleshooting Tips:</Text>
                                {getTroubleshootingTips(key as keyof typeof status).map((tip, index) => (
                                    <Text key={index} style={styles.troubleshootingTip}>
                                        • {tip}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </Card>

            {/* Quick Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        // TODO: Implement refresh functionality
                    }}
                >
                    <Text style={styles.actionButtonText}>Refresh Status</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => router.push('/student/(stack)/device-setup')}
                >
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                        Device Setup
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.textSecondary,
    },
    header: {
        padding: 20,
        backgroundColor: colors.primary,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
    },
    section: {
        margin: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: colors.text,
    },
    statusItem: {
        marginBottom: 20,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
    },
    troubleshootingContainer: {
        marginTop: 8,
        padding: 12,
        backgroundColor: colors.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    troubleshootingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    troubleshootingTip: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    actions: {
        padding: 16,
        gap: 12,
    },
    actionButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: colors.primary,
    },
}); 