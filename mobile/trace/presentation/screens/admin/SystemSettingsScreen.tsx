import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export const SystemSettingsScreen = observer(() => {
    const [settings, setSettings] = React.useState({
        enableMockApi: false,
        enableNotifications: true,
        enableAutoBackup: true,
        darkMode: false,
        debugMode: false,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // TODO: Use this as the settings screen for all users
    // use props to pass the settings to the screen

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="settings" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>System Settings</Text>
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Mock API</Text>
                        <Text style={styles.settingDescription}>Use mock data for testing</Text>
                    </View>
                    <Switch
                        value={settings.enableMockApi}
                        onValueChange={() => toggleSetting('enableMockApi')}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Notifications</Text>
                        <Text style={styles.settingDescription}>Enable system notifications</Text>
                    </View>
                    <Switch
                        value={settings.enableNotifications}
                        onValueChange={() => toggleSetting('enableNotifications')}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Auto Backup</Text>
                        <Text style={styles.settingDescription}>Enable automatic system backup</Text>
                    </View>
                    <Switch
                        value={settings.enableAutoBackup}
                        onValueChange={() => toggleSetting('enableAutoBackup')}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Dark Mode</Text>
                        <Text style={styles.settingDescription}>Enable dark theme</Text>
                    </View>
                    <Switch
                        value={settings.darkMode}
                        onValueChange={() => toggleSetting('darkMode')}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>Debug Mode</Text>
                        <Text style={styles.settingDescription}>Enable debug logging</Text>
                    </View>
                    <Switch
                        value={settings.debugMode}
                        onValueChange={() => toggleSetting('debugMode')}
                        trackColor={{ false: colors.border, true: colors.primary }}
                    />
                </View>
            </Card>

            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="backup" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Backup & Restore</Text>
                </View>
                
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Create Backup</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Restore System</Text>
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
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 