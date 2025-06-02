import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '@/config/env';

export const axiosInstance = axios.create({
    baseURL: env.API_URL,
    timeout: env.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
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

        // Handle token refresh when either cookie session or token expires
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await AsyncStorage.getItem(env.REFRESH_TOKEN_KEY);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh endpoint - this will update both cookies and tokens
                const response = await axios.post(`${env.API_URL}/auth/refresh`, {
                    refreshToken,
                }, {
                    withCredentials: true, // Important: ensure cookies are sent/received in refresh
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Store new tokens
                await AsyncStorage.setItem(env.AUTH_TOKEN_KEY, accessToken);
                await AsyncStorage.setItem(env.REFRESH_TOKEN_KEY, newRefreshToken);

                // Update Authorization header
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry the original request - it will now have both new cookies and token
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear both cookies and tokens
                await AsyncStorage.removeItem(env.AUTH_TOKEN_KEY);
                await AsyncStorage.removeItem(env.REFRESH_TOKEN_KEY);

                // The backend /auth/logout endpoint will clear cookies
                try {
                    await axiosInstance.post('/auth/logout');
                } catch (logoutError) {
                    // Even if logout fails, we still want to reject the original error
                    console.error('Logout failed after refresh token error:', logoutError);
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
); 