export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr';

export interface NotificationSettings {
    attendanceReminders: boolean;
    classUpdates: boolean;
    announcements: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

export interface PrivacySettings {
    shareAttendance: boolean;
    shareLocation: boolean;
    shareProfile: boolean;
    biometricAuth: boolean;
    nfcEnabled: boolean;
    bleEnabled: boolean;
}

export interface AppSettings {
    id: string;
    userId: string;
    theme: Theme;
    language: Language;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    createdAt: Date;
    updatedAt: Date;
}
