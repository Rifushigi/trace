import { SettingsUseCase } from '@/domain/usecases/settings/SettingsUseCase';
import { SettingsRepository } from '@/domain/repositories/SettingsRepository';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';

export class SettingsUseCaseImpl implements SettingsUseCase {
    constructor(private settingsRepository: SettingsRepository) { }

    async getSettings(): Promise<AppSettings> {
        return this.settingsRepository.getSettings();
    }

    async loadSettings(): Promise<AppSettings> {
        return this.settingsRepository.getSettings();
    }

    async updateTheme(theme: Theme): Promise<AppSettings> {
        return this.settingsRepository.updateTheme(theme);
    }

    async updateLanguage(language: Language): Promise<AppSettings> {
        return this.settingsRepository.updateLanguage(language);
    }

    async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<AppSettings> {
        return this.settingsRepository.updateNotificationSettings(settings);
    }

    async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<AppSettings> {
        return this.settingsRepository.updatePrivacySettings(settings);
    }

    async resetSettings(): Promise<AppSettings> {
        return this.settingsRepository.resetSettings();
    }
}