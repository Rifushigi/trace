import Constants from 'expo-constants';

interface Env {
    API_URL: string;
    API_TIMEOUT: number;
    AUTH_TOKEN_KEY: string;
    REFRESH_TOKEN_KEY: string;
    ENABLE_ANALYTICS: boolean;
    ENABLE_CRASH_REPORTING: boolean;
    APP_VERSION: string;
    BUILD_NUMBER: string;
}

const ENV = {
    dev: {
        API_URL: 'http://localhost:3000/api',
        API_TIMEOUT: 30000,
        AUTH_TOKEN_KEY: 'auth_token',
        REFRESH_TOKEN_KEY: 'refresh_token',
        ENABLE_ANALYTICS: false,
        ENABLE_CRASH_REPORTING: false,
        APP_VERSION: '1.0.0',
        BUILD_NUMBER: '1',
    },
    staging: {
        API_URL: 'https://staging-api.trace.com/api',
        API_TIMEOUT: 30000,
        AUTH_TOKEN_KEY: 'auth_token',
        REFRESH_TOKEN_KEY: 'refresh_token',
        ENABLE_ANALYTICS: true,
        ENABLE_CRASH_REPORTING: true,
        APP_VERSION: '1.0.0',
        BUILD_NUMBER: '1',
    },
    prod: {
        API_URL: 'https://api.trace.com/api',
        API_TIMEOUT: 30000,
        AUTH_TOKEN_KEY: 'auth_token',
        REFRESH_TOKEN_KEY: 'refresh_token',
        ENABLE_ANALYTICS: true,
        ENABLE_CRASH_REPORTING: true,
        APP_VERSION: '1.0.0',
        BUILD_NUMBER: '1',
    },
};

const getEnvVars = (): Env => {
    const env = Constants.expoConfig?.extra?.ENV || 'dev';
    return ENV[env as keyof typeof ENV];
};

export default getEnvVars(); 