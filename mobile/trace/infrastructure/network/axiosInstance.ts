import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../../config/env';

export const axiosInstance = axios.create({
    baseURL: env.API_URL,
    timeout: env.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(env.AUTH_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await AsyncStorage.getItem(env.REFRESH_TOKEN_KEY);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call your refresh token endpoint
                const response = await axios.post(`${env.API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;
                await AsyncStorage.setItem(env.AUTH_TOKEN_KEY, accessToken);
                await AsyncStorage.setItem(env.REFRESH_TOKEN_KEY, newRefreshToken);

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure (e.g., logout user)
                await AsyncStorage.removeItem(env.AUTH_TOKEN_KEY);
                await AsyncStorage.removeItem(env.REFRESH_TOKEN_KEY);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
); 