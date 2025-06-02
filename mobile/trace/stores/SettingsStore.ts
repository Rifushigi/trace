import { makeAutoObservable } from 'mobx';
import { SettingsUseCase } from '@/domain/usecases/settings/SettingsUseCase';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';
import { SettingsError } from '@/shared/errors/AppError';
import { handleError } from '@/shared/errors/errorHandler';

export class SettingsStore {
    public readonly settingsUseCase: SettingsUseCase;
    public settings: AppSettings;
    public isLoading: boolean = false;
    public error: SettingsError | null = null;

    constructor(settingsUseCase: SettingsUseCase) {
        this.settingsUseCase = settingsUseCase;
        this.settings = {
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
        makeAutoObservable(this);
    }

    async loadSettings() {
        this.isLoading = true;
        this.error = null;
        try {
            const settings = await this.settingsUseCase.loadSettings();
            this.settings = settings;
        } catch (error) {
            this.error = handleError(error) as SettingsError;
            console.error('Failed to load settings:', error);
        } finally {
            this.isLoading = false;
        }
    }

    async updateTheme(theme: Theme) {
        this.isLoading = true;
        this.error = null;
        try {
            const updatedSettings = await this.settingsUseCase.updateTheme(theme);
            this.settings = updatedSettings;
        } catch (error) {
            this.error = handleError(error) as SettingsError;
            console.error('Failed to update theme:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async updateLanguage(language: Language) {
        this.isLoading = true;
        this.error = null;
        try {
            const updatedSettings = await this.settingsUseCase.updateLanguage(language);
            this.settings = updatedSettings;
        } catch (error) {
            this.error = handleError(error) as SettingsError;
            console.error('Failed to update language:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async updateNotificationSettings(notifications: NotificationSettings) {
        this.isLoading = true;
        this.error = null;
        try {
            const updatedSettings = await this.settingsUseCase.updateNotificationSettings(notifications);
            this.settings = updatedSettings;
        } catch (error) {
            this.error = handleError(error) as SettingsError;
            console.error('Failed to update notification settings:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async updatePrivacySettings(privacy: PrivacySettings) {
        this.isLoading = true;
        this.error = null;
        try {
            const updatedSettings = await this.settingsUseCase.updatePrivacySettings(privacy);
            this.settings = updatedSettings;
        } catch (error) {
            this.error = handleError(error) as SettingsError;
            console.error('Failed to update privacy settings:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async resetSettings() {
        this.isLoading = true;
        this.error = null;
        try {
            const defaultSettings = await this.settingsUseCase.resetSettings();
            this.settings = defaultSettings;
        } catch (error) {
            this.error = handleError(error) as SettingsError;
            console.error('Failed to reset settings:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
} 