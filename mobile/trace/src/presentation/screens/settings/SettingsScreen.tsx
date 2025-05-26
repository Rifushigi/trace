import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    ScrollView,
    Alert,
} from 'react-native';
import { useStores } from '../../../stores';
import { observer } from 'mobx-react-lite';
import { Theme, Language } from '../../../domain/entities/Settings';

export const SettingsScreen = observer(() => {
    const { settingsStore } = useStores();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            await settingsStore.loadSettings();
        } catch (error) {
            Alert.alert('Error', 'Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleThemeChange = async (theme: Theme) => {
        try {
            await settingsStore.updateTheme(theme);
        } catch (error) {
            Alert.alert('Error', 'Failed to update theme');
        }
    };

    const handleLanguageChange = async (language: Language) => {
        try {
            await settingsStore.updateLanguage(language);
        } catch (error) {
            Alert.alert('Error', 'Failed to update language');
        }
    };

    const handleNotificationChange = async (key: 'announcements' | 'emailNotifications', value: boolean) => {
        try {
            await settingsStore.updateNotificationSettings({
                ...settingsStore.settings.notifications,
                [key]: value,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to update notification settings');
        }
    };

    const handlePrivacyChange = async (key: 'shareAttendance', value: boolean) => {
        try {
            await settingsStore.updatePrivacySettings({
                ...settingsStore.settings.privacy,
                [key]: value,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to update privacy settings');
        }
    };

    const handleResetSettings = async () => {
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
                    onPress: async () => {
                        try {
                            await settingsStore.resetSettings();
                            Alert.alert('Success', 'Settings have been reset to default values');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reset settings');
                        }
                    },
                },
            ],
        );
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading settings...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Appearance</Text>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Theme</Text>
                    <View style={styles.themeButtons}>
                        <TouchableOpacity
                            style={[
                                styles.themeButton,
                                settingsStore.settings.theme === 'light' && styles.selectedTheme,
                            ]}
                            onPress={() => handleThemeChange('light')}
                        >
                            <Text style={styles.themeButtonText}>Light</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.themeButton,
                                settingsStore.settings.theme === 'dark' && styles.selectedTheme,
                            ]}
                            onPress={() => handleThemeChange('dark')}
                        >
                            <Text style={styles.themeButtonText}>Dark</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Language</Text>
                    <View style={styles.languageButtons}>
                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                settingsStore.settings.language === 'en' && styles.selectedLanguage,
                            ]}
                            onPress={() => handleLanguageChange('en')}
                        >
                            <Text style={styles.languageButtonText}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                settingsStore.settings.language === 'es' && styles.selectedLanguage,
                            ]}
                            onPress={() => handleLanguageChange('es')}
                        >
                            <Text style={styles.languageButtonText}>Spanish</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                settingsStore.settings.language === 'fr' && styles.selectedLanguage,
                            ]}
                            onPress={() => handleLanguageChange('fr')}
                        >
                            <Text style={styles.languageButtonText}>French</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Announcements</Text>
                    <Switch
                        value={settingsStore.settings.notifications.announcements}
                        onValueChange={(value) => handleNotificationChange('announcements', value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Email Notifications</Text>
                    <Switch
                        value={settingsStore.settings.notifications.emailNotifications}
                        onValueChange={(value) => handleNotificationChange('emailNotifications', value)}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy</Text>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Share Attendance</Text>
                    <Switch
                        value={settingsStore.settings.privacy.shareAttendance}
                        onValueChange={(value) => handlePrivacyChange('shareAttendance', value)}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
                <Text style={styles.resetButtonText}>Reset All Settings</Text>
            </TouchableOpacity>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionLabel: {
        fontSize: 16,
    },
    themeButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    themeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    selectedTheme: {
        backgroundColor: '#007AFF',
    },
    themeButtonText: {
        fontSize: 14,
    },
    languageButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    languageButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    selectedLanguage: {
        backgroundColor: '#007AFF',
    },
    languageButtonText: {
        fontSize: 14,
    },
    resetButton: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 