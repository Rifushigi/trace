import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';
import { AppError } from '@/shared/errors/AppError';

export interface SettingsRepository {
    getSettings(): Promise<AppSettings | AppError>;
    updateTheme(theme: Theme): Promise<AppSettings | AppError>;
    updateLanguage(language: Language): Promise<AppSettings | AppError>;
    updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<AppSettings | AppError>;
    updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<AppSettings | AppError>;
    resetSettings(): Promise<AppSettings | AppError>;
} 