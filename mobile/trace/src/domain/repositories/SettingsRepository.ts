import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '../entities/Settings';

export interface SettingsRepository {
    /**
     * Get the current user's settings
     */
    getSettings(): Promise<AppSettings>;

    /**
     * Update the user's theme preference
     */
    updateTheme(theme: Theme): Promise<AppSettings>;

    /**
     * Update the user's language preference
     */
    updateLanguage(language: Language): Promise<AppSettings>;

    /**
     * Update the user's notification settings
     */
    updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<AppSettings>;

    /**
     * Update the user's privacy settings
     */
    updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<AppSettings>;

    /**
     * Reset all settings to default values
     */
    resetSettings(): Promise<AppSettings>;
} 