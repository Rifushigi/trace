import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';

export interface SettingsService {
    getSettings(): Promise<AppSettings>;
    loadSettings(): Promise<AppSettings>;
    updateTheme(theme: Theme): Promise<AppSettings>;
    updateLanguage(language: Language): Promise<AppSettings>;
    updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<AppSettings>;
    updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<AppSettings>;
    resetSettings(): Promise<AppSettings>;
} 