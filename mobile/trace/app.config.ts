import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'Trace',
    slug: 'trace',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.trace.app'
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff'
        },
        package: 'com.trace.app'
    },
    web: {
        favicon: './assets/favicon.png'
    },
    extra: {
        ENV: process.env.ENV || 'dev',
        eas: {
            projectId: process.env.EAS_PROJECT_ID
        }
    },
    plugins: [
        'expo-router',
        'expo-secure-store',
        'expo-localization'
    ]
}); 