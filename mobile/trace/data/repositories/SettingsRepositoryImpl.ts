import { SettingsRepository } from '@/domain/repositories/SettingsRepository';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';
import { SettingsApi } from '@/data/datasources/remote/SettingsApi';

export class SettingsRepositoryImpl implements SettingsRepository {
    constructor(private readonly settingsApi: SettingsApi) { }

    async getSettings(): Promise<AppSettings> {
        return this.settingsApi.getSettings();
    }

    async updateTheme(theme: Theme): Promise<AppSettings> {
        return this.settingsApi.updateTheme(theme);
    }

    async updateLanguage(language: Language): Promise<AppSettings> {
        return this.settingsApi.updateLanguage(language);
    }

    async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<AppSettings> {
        return this.settingsApi.updateNotificationSettings(settings);
    }

    async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<AppSettings> {
        return this.settingsApi.updatePrivacySettings(settings);
    }

    async resetSettings(): Promise<AppSettings> {
        return this.settingsApi.resetSettings();
    }
} 