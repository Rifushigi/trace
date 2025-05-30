import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '../../../domain/entities/Settings';
import { axiosInstance } from '../../../infrastructure/network/axiosInstance';

export class SettingsApi {
    private readonly BASE_URL = '/settings';

    async getSettings(): Promise<AppSettings> {
        const response = await axiosInstance.get<AppSettings>(`${this.BASE_URL}`);
        return response.data;
    }

    async updateTheme(theme: Theme): Promise<AppSettings> {
        const response = await axiosInstance.patch<AppSettings>(`${this.BASE_URL}/theme`, { theme });
        return response.data;
    }

    async updateLanguage(language: Language): Promise<AppSettings> {
        const response = await axiosInstance.patch<AppSettings>(`${this.BASE_URL}/language`, { language });
        return response.data;
    }

    async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<AppSettings> {
        const response = await axiosInstance.patch<AppSettings>(`${this.BASE_URL}/notifications`, settings);
        return response.data;
    }

    async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<AppSettings> {
        const response = await axiosInstance.patch<AppSettings>(`${this.BASE_URL}/privacy`, settings);
        return response.data;
    }

    async resetSettings(): Promise<AppSettings> {
        const response = await axiosInstance.post<AppSettings>(`${this.BASE_URL}/reset`);
        return response.data;
    }
} 