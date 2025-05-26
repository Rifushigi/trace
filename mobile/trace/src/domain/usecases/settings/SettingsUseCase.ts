import { AppSettings, Theme, Language } from '../../entities/Settings';
import { SettingsRepository } from '../../repositories/SettingsRepository';

export class SettingsUseCase {
    constructor(private settingsRepository: SettingsRepository) { }

    async loadSettings(): Promise<AppSettings> {
        try {
            return await this.settingsRepository.getSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
            throw error;
        }
    }

    async updateTheme(theme: Theme): Promise<void> {
        try {
            await this.settingsRepository.updateTheme(theme);
        } catch (error) {
            console.error('Error updating theme:', error);
            throw error;
        }
    }

    async updateLanguage(language: Language): Promise<void> {
        try {
            await this.settingsRepository.updateLanguage(language);
        } catch (error) {
            console.error('Error updating language:', error);
            throw error;
        }
    }

    async updateNotificationSettings(settings: {
        announcements: boolean;
        emailNotifications: boolean;
    }): Promise<void> {
        try {
            await this.settingsRepository.updateNotificationSettings(settings);
        } catch (error) {
            console.error('Error updating notification settings:', error);
            throw error;
        }
    }

    async updatePrivacySettings(settings: {
        shareAttendance: boolean;
    }): Promise<void> {
        try {
            await this.settingsRepository.updatePrivacySettings(settings);
        } catch (error) {
            console.error('Error updating privacy settings:', error);
            throw error;
        }
    }

    async resetSettings(): Promise<void> {
        try {
            await this.settingsRepository.resetSettings();
        } catch (error) {
            console.error('Error resetting settings:', error);
            throw error;
        }
    }
} 