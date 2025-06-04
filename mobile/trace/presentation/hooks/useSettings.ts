import { useStores } from '@/stores';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';
import { useApi } from './useApi';

export const useSettings = () => {
    const { settingsStore } = useStores();

    const { execute: loadSettings, isLoading: isLoadingSettings, error: loadSettingsError } = useApi<AppSettings, typeof settingsStore>({
        store: settingsStore,
        action: (store) => async () => {
            await store.loadSettings();
            return store.settings;
        },
    });

    const { execute: updateTheme, isLoading: isUpdatingTheme, error: updateThemeError } = useApi<AppSettings, typeof settingsStore>({
        store: settingsStore,
        action: (store) => async (theme: Theme) => {
            await store.updateTheme(theme);
            return store.settings;
        },
    });

    const { execute: updateLanguage, isLoading: isUpdatingLanguage, error: updateLanguageError } = useApi<AppSettings, typeof settingsStore>({
        store: settingsStore,
        action: (store) => async (language: Language) => {
            await store.updateLanguage(language);
            return store.settings;
        },
    });

    const { execute: updateNotificationSettings, isLoading: isUpdatingNotifications, error: updateNotificationsError } = useApi<AppSettings, typeof settingsStore>({
        store: settingsStore,
        action: (store) => async (partialSettings: Partial<NotificationSettings>) => {
            const currentSettings = store.settings.notifications;
            const newSettings: NotificationSettings = {
                ...currentSettings,
                ...partialSettings,
            };
            await store.updateNotificationSettings(newSettings);
            return store.settings;
        },
    });

    const { execute: updatePrivacySettings, isLoading: isUpdatingPrivacy, error: updatePrivacyError } = useApi<AppSettings, typeof settingsStore>({
        store: settingsStore,
        action: (store) => async (partialSettings: Partial<PrivacySettings>) => {
            const currentSettings = store.settings.privacy;
            const newSettings: PrivacySettings = {
                ...currentSettings,
                ...partialSettings,
            };
            await store.updatePrivacySettings(newSettings);
            return store.settings;
        },
    });

    const { execute: resetSettings, isLoading: isResettingSettings, error: resetSettingsError } = useApi<AppSettings, typeof settingsStore>({
        store: settingsStore,
        action: (store) => async () => {
            await store.resetSettings();
            return store.settings;
        },
    });

    return {
        // State
        settings: settingsStore.settings,

        // Loading States
        isLoadingSettings,
        isUpdatingTheme,
        isUpdatingLanguage,
        isUpdatingNotifications,
        isUpdatingPrivacy,
        isResettingSettings,

        // Error States
        loadSettingsError,
        updateThemeError,
        updateLanguageError,
        updateNotificationsError,
        updatePrivacyError,
        resetSettingsError,

        // Operations
        loadSettings,
        updateTheme,
        updateLanguage,
        updateNotificationSettings,
        updatePrivacySettings,
        resetSettings,
    };
}; 