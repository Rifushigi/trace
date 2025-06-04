import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '@/components/common/Card';
import { colors } from '@/shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useSettings } from '@/presentation/hooks/useSettings';
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';


export const SystemSettingsScreen = observer(() => {
    const { user, logout } = useAuth();
    const { handleError } = useErrorHandler({
        showErrorAlert: true,
        onNetworkError: (error) => {
            Alert.alert('Network Error', 'Please check your internet connection');
        }
    });

    const { 
        settings,
        updateTheme,
        updateNotificationSettings,
        updatePrivacySettings,
        createBackup,
        restoreSystem,
        isCreatingBackup,
        isRestoringSystem,
    } = useSettings();

    const handleThemeChange = async (value: boolean) => {
        await updateTheme(value ? 'dark' : 'light');
    };

    const handleNotificationChange = async (value: boolean) => {
        await updateNotificationSettings({ pushNotifications: value });
    };

    const handleBiometricChange = async (value: boolean) => {
        await updatePrivacySettings({ biometricAuth: value });
    };

    const handleNfcChange = async (value: boolean) => {
        await updatePrivacySettings({ nfcEnabled: value });
    };

    const handleBleChange = async (value: boolean) => {
        await updatePrivacySettings({ bleEnabled: value });
    };

    const handleBackup = async () => {
        await handleError(async () => {
            await createBackup();
            Alert.alert('Success', 'System backup created successfully');
        }, 'Failed to create backup');
    };

    const handleRestore = async () => {
        await handleError(async () => {
            await restoreSystem();
            Alert.alert('Success', 'System restored successfully');
        }, 'Failed to restore system');
    };

    const handleLogout = async () => {
        await handleError(async () => {
            await logout();
        }, 'Failed to logout');
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="settings" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>System Settings</Text>
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Theme</Text>
                        <Text style={styles.settingDescription}>Enable dark theme</Text>
                    </View>
                    <Switch
                        value={settings.theme === 'dark'}
                        onValueChange={handleThemeChange}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Notifications</Text>
                        <Text style={styles.settingDescription}>Enable system notifications</Text>
                    </View>
                    <Switch
                        value={settings.notifications.pushNotifications}
                        onValueChange={handleNotificationChange}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Biometric Auth</Text>
                        <Text style={styles.settingDescription}>Enable biometric authentication</Text>
                    </View>
                    <Switch
                        value={settings.privacy.biometricAuth}
                        onValueChange={handleBiometricChange}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>NFC</Text>
                        <Text style={styles.settingDescription}>Enable NFC functionality</Text>
                    </View>
                    <Switch
                        value={settings.privacy.nfcEnabled}
                        onValueChange={handleNfcChange}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Bluetooth</Text>
                        <Text style={styles.settingDescription}>Enable Bluetooth functionality</Text>
                    </View>
                    <Switch
                        value={settings.privacy.bleEnabled}
                        onValueChange={handleBleChange}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Account</Text>
                        <Text style={styles.settingDescription}>Logged in as {user?.email}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Card>

            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="backup" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Backup & Restore</Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.actionButton, isCreatingBackup && styles.actionButtonDisabled]}
                    onPress={handleBackup}
                    disabled={isCreatingBackup}
                >
                    <Text style={styles.actionButtonText}>
                        {isCreatingBackup ? 'Creating Backup...' : 'Create Backup'}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.actionButton, isRestoringSystem && styles.actionButtonDisabled]}
                    onPress={handleRestore}
                    disabled={isRestoringSystem}
                >
                    <Text style={styles.actionButtonText}>
                        {isRestoringSystem ? 'Restoring System...' : 'Restore System'}
                    </Text>
                </TouchableOpacity>
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
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    settingDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    actionButton: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: colors.error,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
}); 