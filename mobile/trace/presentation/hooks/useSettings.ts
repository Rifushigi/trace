import { useStores } from '@/stores';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '@/domain/entities/Settings';
import { useApi } from './useApi';
import { useNetworkStatus } from './useNetworkStatus';

export const useSettings = () => {
    const { settingsStore } = useStores();
    const { isConnected, isInternetReachable } = useNetworkStatus();
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

    const { execute: createBackup, isLoading: isCreatingBackup } = useApi<void, any>({
        store: null,
        action: () => async () => {
            if (!isConnected || !isInternetReachable) {
                throw new Error('No internet connection');
            }
            // TODO: Implement backup creation
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
    });

    const { execute: restoreSystem, isLoading: isRestoringSystem } = useApi<void, any>({
        store: null,
        action: () => async () => {
            if (!isConnected || !isInternetReachable) {
                throw new Error('No internet connection');
            }
            // TODO: Implement system restore
            await new Promise(resolve => setTimeout(resolve, 1000));
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
        isCreatingBackup,
        isRestoringSystem,

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
        createBackup,
        restoreSystem,
    };
}; 