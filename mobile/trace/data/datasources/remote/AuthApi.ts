import { axiosInstance } from '@/infrastructure/network/axiosInstance';
import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm, IAuthApi } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import { withErrorHandling } from '@/shared/errors/errorHandler';

export class AuthApi implements IAuthApi {
    readonly BASE_URL = '/auth';

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
        return withErrorHandling(
            async () => {
                const response = await axiosInstance.post(`${this.BASE_URL}/login`, credentials);
                return response.data;
            },
            'Failed to login'
        );
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
        return withErrorHandling(
            async () => {
                const response = await axiosInstance.post(`${this.BASE_URL}/register`, data);
                return response.data;
            },
            'Failed to register'
        );
    }

    async logout(): Promise<void> {
        return withErrorHandling(
            async () => {
                await axiosInstance.post(`${this.BASE_URL}/logout`);
            },
            'Failed to logout'
        );
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        return withErrorHandling(
            async () => {
                const response = await axiosInstance.post(`${this.BASE_URL}/refresh`, { refreshToken });
                return response.data;
            },
            'Failed to refresh token'
        );
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
        return withErrorHandling(
            async () => {
                await axiosInstance.post(`${this.BASE_URL}/reset-password`, data);
            },
            'Failed to request password reset'
        );
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
        return withErrorHandling(
            async () => {
                await axiosInstance.post(`${this.BASE_URL}/confirm-reset`, data);
            },
            'Failed to confirm password reset'
        );
    }

    async verifyEmail(token: string): Promise<void> {
        return withErrorHandling(
            async () => {
                await axiosInstance.post(`${this.BASE_URL}/verify-email`, { token });
            },
            'Failed to verify email'
        );
    }

    async getCurrentUser(): Promise<User | null> {
        return withErrorHandling(
            async () => {
                const response = await axiosInstance.get(`${this.BASE_URL}/me`);
                return response.data;
            },
            'Failed to get current user'
        );
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        return withErrorHandling(
            async () => {
                await axiosInstance.put(`${this.BASE_URL}/password`, { oldPassword, newPassword });
            },
            'Failed to update password'
        );
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        return withErrorHandling(
            async () => {
                const response = await axiosInstance.put(`${this.BASE_URL}/profile`, data);
                return response.data;
            },
            'Failed to update profile'
        );
    }
} 