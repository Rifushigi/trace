import { SettingsService } from '@/domain/services/settings/SettingService';
import { SettingsRepository } from '@/domain/repositories/SettingsRepository';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';
import { AppError } from '@/shared/errors/AppError';

export class SettingsServiceImpl implements SettingsService {
    constructor(private settingsRepository: SettingsRepository) { }

    async getSettings(): Promise<AppSettings> {
        const result = await this.settingsRepository.getSettings();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async loadSettings(): Promise<AppSettings> {
        const result = await this.settingsRepository.getSettings();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updateTheme(theme: Theme): Promise<AppSettings> {
        const result = await this.settingsRepository.updateTheme(theme);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updateLanguage(language: Language): Promise<AppSettings> {
        const result = await this.settingsRepository.updateLanguage(language);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<AppSettings> {
        const result = await this.settingsRepository.updateNotificationSettings(settings);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<AppSettings> {
        const result = await this.settingsRepository.updatePrivacySettings(settings);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async resetSettings(): Promise<AppSettings> {
        const result = await this.settingsRepository.resetSettings();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }
}