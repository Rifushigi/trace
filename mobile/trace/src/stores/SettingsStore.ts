import { makeAutoObservable } from 'mobx';
import { SettingsUseCase } from '../domain/usecases/settings/SettingsUseCase';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '../domain/entities/Settings';

export class SettingsStore {
    public readonly settingsUseCase: SettingsUseCase;
    public settings: AppSettings = {
        id: '',
        userId: '',
        theme: 'system',
        language: 'en',
        notifications: {
            attendanceReminders: true,
            classUpdates: true,
            announcements: true,
            emailNotifications: true,
            pushNotifications: true,
        },
        privacy: {
            shareAttendance: true,
            shareLocation: true,
            shareProfile: true,
            biometricAuth: true,
            nfcEnabled: true,
            bleEnabled: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    constructor(settingsUseCase: SettingsUseCase) {
        this.settingsUseCase = settingsUseCase;
        makeAutoObservable(this);
        this.loadSettings();
    }

    async loadSettings() {
        try {
            const settings = await this.settingsUseCase.getSettings();
            this.settings = settings;
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async updateTheme(theme: Theme) {
        try {
            const updatedSettings = await this.settingsUseCase.updateTheme(theme);
            this.settings = updatedSettings;
        } catch (error) {
            console.error('Failed to update theme:', error);
            throw error;
        }
    }

    async updateLanguage(language: Language) {
        try {
            const updatedSettings = await this.settingsUseCase.updateLanguage(language);
            this.settings = updatedSettings;
        } catch (error) {
            console.error('Failed to update language:', error);
            throw error;
        }
    }

    async updateNotificationSettings(notifications: NotificationSettings) {
        try {
            const updatedSettings = await this.settingsUseCase.updateNotificationSettings(notifications);
            this.settings = updatedSettings;
        } catch (error) {
            console.error('Failed to update notification settings:', error);
            throw error;
        }
    }

    async updatePrivacySettings(privacy: PrivacySettings) {
        try {
            const updatedSettings = await this.settingsUseCase.updatePrivacySettings(privacy);
            this.settings = updatedSettings;
        } catch (error) {
            console.error('Failed to update privacy settings:', error);
            throw error;
        }
    }

    async resetSettings() {
        try {
            const defaultSettings = await this.settingsUseCase.resetSettings();
            this.settings = defaultSettings;
        } catch (error) {
            console.error('Failed to reset settings:', error);
            throw error;
        }
    }
} 