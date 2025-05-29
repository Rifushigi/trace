import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { Student } from '../../../domain/entities/User';
import { router } from 'expo-router';

export const StudentSettingsScreen = observer(() => {
    const { authStore, settingsStore } = useStores();
    const user = authStore.state.user as Student;

    // Attendance Notification Settings
    const [attendanceNotifications, setAttendanceNotifications] = useState({
        beforeClass: true,
        duringClass: true,
        afterClass: true,
        lowAttendance: true,
    });

    // Device Configuration Settings
    const [deviceSettings, setDeviceSettings] = useState({
        autoConnect: true,
        backgroundScanning: true,
        highAccuracy: true,
    });

    // Privacy Settings
    const [privacySettings, setPrivacySettings] = useState({
        shareAttendance: false,
        shareLocation: false,
        shareDeviceInfo: true,
    });

    const handleAttendanceNotificationChange = (key: keyof typeof attendanceNotifications, value: boolean) => {
        setAttendanceNotifications(prev => ({
            ...prev,
            [key]: value,
        }));
        // TODO: Save to backend
    };

    const handleDeviceSettingChange = (key: keyof typeof deviceSettings, value: boolean) => {
        setDeviceSettings(prev => ({
            ...prev,
            [key]: value,
        }));
        // TODO: Save to backend
    };

    const handlePrivacySettingChange = (key: keyof typeof privacySettings, value: boolean) => {
        setPrivacySettings(prev => ({
            ...prev,
            [key]: value,
        }));
        // TODO: Save to backend
    };

    const handleResetSettings = () => {
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all settings to default values?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        // Reset all settings to default values
                        setAttendanceNotifications({
                            beforeClass: true,
                            duringClass: true,
                            afterClass: true,
                            lowAttendance: true,
                        });
                        setDeviceSettings({
                            autoConnect: true,
                            backgroundScanning: true,
                            highAccuracy: true,
                        });
                        setPrivacySettings({
                            shareAttendance: false,
                            shareLocation: false,
                            shareDeviceInfo: true,
                        });
                        // TODO: Save to backend
                    },
                },
            ],
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Attendance Notifications */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Attendance Notifications</Text>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Before Class</Text>
                    <Switch
                        value={attendanceNotifications.beforeClass}
                        onValueChange={(value) => handleAttendanceNotificationChange('beforeClass', value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>During Class</Text>
                    <Switch
                        value={attendanceNotifications.duringClass}
                        onValueChange={(value) => handleAttendanceNotificationChange('duringClass', value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>After Class</Text>
                    <Switch
                        value={attendanceNotifications.afterClass}
                        onValueChange={(value) => handleAttendanceNotificationChange('afterClass', value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Low Attendance Alerts</Text>
                    <Switch
                        value={attendanceNotifications.lowAttendance}
                        onValueChange={(value) => handleAttendanceNotificationChange('lowAttendance', value)}
                    />
                </View>
            </Card>

            {/* Device Configuration */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Device Configuration</Text>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Auto-Connect to Beacons</Text>
                    <Switch
                        value={deviceSettings.autoConnect}
                        onValueChange={(value) => handleDeviceSettingChange('autoConnect', value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Background Scanning</Text>
                    <Switch
                        value={deviceSettings.backgroundScanning}
                        onValueChange={(value) => handleDeviceSettingChange('backgroundScanning', value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>High Accuracy Mode</Text>
                    <Switch
                        value={deviceSettings.highAccuracy}
                        onValueChange={(value) => handleDeviceSettingChange('highAccuracy', value)}
                    />
                </View>
            </Card>

            {/* Privacy Settings */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy Settings</Text>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Share Attendance Status</Text>
                    <Switch
                        value={privacySettings.shareAttendance}
                        onValueChange={(value) => handlePrivacySettingChange('shareAttendance', value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Share Location</Text>
                    <Switch
                        value={privacySettings.shareLocation}
                        onValueChange={(value) => handlePrivacySettingChange('shareLocation', value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Share Device Information</Text>
                    <Switch
                        value={privacySettings.shareDeviceInfo}
                        onValueChange={(value) => handlePrivacySettingChange('shareDeviceInfo', value)}
                    />
                </View>
            </Card>

            {/* Help & Support */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Help & Support</Text>
                <TouchableOpacity
                    style={styles.supportButton}
                    onPress={() => router.push('/student/(stack)/device-setup')}
                >
                    <Text style={styles.supportButtonText}>Device Setup Guide</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.supportButton}
                    onPress={() => {
                        // TODO: Implement FAQ navigation
                        Alert.alert('Coming Soon', 'FAQ section will be available soon');
                    }}
                >
                    <Text style={styles.supportButtonText}>FAQ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.supportButton}
                    onPress={() => {
                        // TODO: Implement contact support
                        Alert.alert('Contact Support', 'Email: support@trace.edu');
                    }}
                >
                    <Text style={styles.supportButtonText}>Contact Support</Text>
                </TouchableOpacity>
            </Card>

            {/* Reset Settings */}
            <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetSettings}
            >
                <Text style={styles.resetButtonText}>Reset All Settings</Text>
            </TouchableOpacity>
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
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    optionLabel: {
        fontSize: 16,
        color: colors.text,
    },
    supportButton: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    supportButtonText: {
        fontSize: 16,
        color: colors.primary,
    },
    resetButton: {
        margin: 16,
        padding: 16,
        backgroundColor: colors.error,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 