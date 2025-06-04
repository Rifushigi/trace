import { useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { useSettings } from './useSettings';
import { Theme } from '@/domain/entities/Settings';

export const useTheme = () => {
    const systemColorScheme = useColorScheme();
    const { settings, updateTheme, isUpdatingTheme, updateThemeError } = useSettings();

    const currentTheme = settings.theme === 'system' ? systemColorScheme : settings.theme;

    const setTheme = useCallback(async (theme: Theme) => {
        await updateTheme(theme);
    }, [updateTheme]);

    const toggleTheme = useCallback(async () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        await updateTheme(newTheme);
    }, [currentTheme, updateTheme]);

    return {
        // State
        theme: currentTheme,
        isDark: currentTheme === 'dark',
        isLight: currentTheme === 'light',
        isSystem: settings.theme === 'system',

        // Loading States
        isUpdatingTheme,

        // Error States
        updateThemeError,

        // Operations
        setTheme,
        toggleTheme,
    };
}; 