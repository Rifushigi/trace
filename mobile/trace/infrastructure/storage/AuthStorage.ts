import env from "@/config/env";
import { AuthTokens } from "@/domain/entities/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthStorage = {
    getAccessToken: async (): Promise<string | null> => {
        return AsyncStorage.getItem(env.AUTH_TOKEN_KEY);
    },
    setAccessToken: async (token: string): Promise<void> => {
        return AsyncStorage.setItem(env.AUTH_TOKEN_KEY, token);
    },
    removeAccessToken: async (): Promise<void> => {
        return AsyncStorage.removeItem(env.AUTH_TOKEN_KEY);
    },
    getRefreshToken: async (): Promise<string | null> => {
        return AsyncStorage.getItem(env.REFRESH_TOKEN_KEY);
    },
    setRefreshToken: async (token: string): Promise<void> => {
        return AsyncStorage.setItem(env.REFRESH_TOKEN_KEY, token);
    },
    removeRefreshToken: async (): Promise<void> => {
        return AsyncStorage.removeItem(env.REFRESH_TOKEN_KEY);
    },
    storeTokens: async (tokens: AuthTokens): Promise<void> => {
        return AsyncStorage.setItem(env.AUTH_TOKEN_KEY, JSON.stringify(tokens));
    },
    removeStoredTokens: async (): Promise<void> => {
        return AsyncStorage.removeItem(env.AUTH_TOKEN_KEY);
    },
    getStoredTokens: async (): Promise<AuthTokens | null> => {
        const tokensJson = await AsyncStorage.getItem(env.AUTH_TOKEN_KEY);
        return tokensJson ? JSON.parse(tokensJson) : null;
    },
}