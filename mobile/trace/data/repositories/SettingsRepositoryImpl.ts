import { SettingsRepository } from '@/domain/repositories/SettingsRepository';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';
import { SettingsApi } from '@/data/datasources/remote/SettingsApi';
import { AppError, RepositoryError } from '@/shared/errors/AppError';

export class SettingsRepositoryImpl implements SettingsRepository {
    constructor(private readonly settingsApi: SettingsApi) { }

    async getSettings(): Promise<AppSettings | AppError> {
        try {
            return await this.settingsApi.getSettings();
        } catch (error) {
            throw new RepositoryError(
                'Error getting settings',
                'SettingsRepository',
                'getSettings',
                error
            );
        }
    }

    async updateTheme(theme: Theme): Promise<AppSettings | AppError> {
        try {
            return await this.settingsApi.updateTheme(theme);
        } catch (error) {
            throw new RepositoryError(
                'Error updating theme',
                'SettingsRepository',
                'updateTheme',
                error
            );
        }
    }

    async updateLanguage(language: Language): Promise<AppSettings | AppError> {
        try {
            return await this.settingsApi.updateLanguage(language);
        } catch (error) {
            throw new RepositoryError(
                'Error updating language',
                'SettingsRepository',
                'updateLanguage',
                error
            );
        }
    }

    async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<AppSettings | AppError> {
        try {
            return await this.settingsApi.updateNotificationSettings(settings);
        } catch (error) {
            throw new RepositoryError(
                'Error updating notification settings',
                'SettingsRepository',
                'updateNotificationSettings',
                error
            );
        }
    }

    async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<AppSettings | AppError> {
        try {
            return await this.settingsApi.updatePrivacySettings(settings);
        } catch (error) {
            throw new RepositoryError(
                'Error updating privacy settings',
                'SettingsRepository',
                'updatePrivacySettings',
                error
            );
        }
    }

    async resetSettings(): Promise<AppSettings | AppError> {
        try {
            return await this.settingsApi.resetSettings();
        } catch (error) {
            throw new RepositoryError(
                'Error resetting settings',
                'SettingsRepository',
                'resetSettings',
                error
            );
        }
    }
} 