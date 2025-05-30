import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';

export const LecturerSettingsScreen = observer(() => {
    const { authStore } = useStores();
    const user = authStore.state.user;

    // Session Preferences
    const [sessionSettings, setSessionSettings] = useState({
        autoStartSession: false,
        autoEndSession: false,
        sessionDuration: 60, // minutes
        allowLateMarking: true,
        requireLocation: true,
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        sessionReminders: true,
        attendanceAlerts: true,
        reportNotifications: true,
        emailNotifications: false,
    });

    // Report Configurations
    const [reportSettings, setReportSettings] = useState({
        defaultReportFormat: 'PDF',
        includeStudentDetails: true,
        includeAttendancePatterns: true,
        autoGenerateReports: false,
    });

    // Default Behaviors
    const [defaultSettings, setDefaultSettings] = useState({
        defaultAttendanceMethod: 'Face Recognition',
        defaultLocationRadius: 100, // meters
        defaultSessionType: 'Regular',
    });

    const handleToggleSetting = (category: string, setting: string, value: boolean) => {
        switch (category) {
            case 'session':
                setSessionSettings({ ...sessionSettings, [setting]: value });
                break;
            case 'notification':
                setNotificationSettings({ ...notificationSettings, [setting]: value });
                break;
            case 'report':
                setReportSettings({ ...reportSettings, [setting]: value });
                break;
        }
    };

    const handleSaveSettings = () => {
        // TODO: Implement settings save
        Alert.alert('Success', 'Settings saved successfully');
    };

    const handleResetSettings = () => {
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all settings to default?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Implement settings reset
                        Alert.alert('Success', 'Settings reset to default');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Session Preferences */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Session Preferences</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Auto-start Session</Text>
                    <Switch
                        value={sessionSettings.autoStartSession}
                        onValueChange={(value) => handleToggleSetting('session', 'autoStartSession', value)}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Auto-end Session</Text>
                    <Switch
                        value={sessionSettings.autoEndSession}
                        onValueChange={(value) => handleToggleSetting('session', 'autoEndSession', value)}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Allow Late Marking</Text>
                    <Switch
                        value={sessionSettings.allowLateMarking}
                        onValueChange={(value) => handleToggleSetting('session', 'allowLateMarking', value)}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Require Location</Text>
                    <Switch
                        value={sessionSettings.requireLocation}
                        onValueChange={(value) => handleToggleSetting('session', 'requireLocation', value)}
                    />
                </View>
            </Card>

            {/* Notification Settings */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Notification Settings</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Session Reminders</Text>
                    <Switch
                        value={notificationSettings.sessionReminders}
                        onValueChange={(value) => handleToggleSetting('notification', 'sessionReminders', value)}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Attendance Alerts</Text>
                    <Switch
                        value={notificationSettings.attendanceAlerts}
                        onValueChange={(value) => handleToggleSetting('notification', 'attendanceAlerts', value)}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Report Notifications</Text>
                    <Switch
                        value={notificationSettings.reportNotifications}
                        onValueChange={(value) => handleToggleSetting('notification', 'reportNotifications', value)}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Email Notifications</Text>
                    <Switch
                        value={notificationSettings.emailNotifications}
                        onValueChange={(value) => handleToggleSetting('notification', 'emailNotifications', value)}
                    />
                </View>
            </Card>

            {/* Report Configurations */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Report Configurations</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Include Student Details</Text>
                    <Switch
                        value={reportSettings.includeStudentDetails}
                        onValueChange={(value) => handleToggleSetting('report', 'includeStudentDetails', value)}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Include Attendance Patterns</Text>
                    <Switch
                        value={reportSettings.includeAttendancePatterns}
                        onValueChange={(value) => handleToggleSetting('report', 'includeAttendancePatterns', value)}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Auto-generate Reports</Text>
                    <Switch
                        value={reportSettings.autoGenerateReports}
                        onValueChange={(value) => handleToggleSetting('report', 'autoGenerateReports', value)}
                    />
                </View>
            </Card>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={handleSaveSettings}
                >
                    <Text style={styles.actionButtonText}>Save Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.resetButton]}
                    onPress={handleResetSettings}
                >
                    <Text style={[styles.actionButtonText, styles.resetButtonText]}>
                        Reset to Default
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
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingLabel: {
        fontSize: 16,
        color: colors.text,
    },
    actions: {
        padding: 16,
    },
    actionButton: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: colors.primary,
    },
    resetButton: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.error,
    },
    actionButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    resetButtonText: {
        color: colors.error,
    },
}); 