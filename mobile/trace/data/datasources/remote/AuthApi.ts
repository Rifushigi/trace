import { axiosInstance } from '../../../infrastructure/network/axiosInstance';
import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '../../../domain/entities/Auth';
import { User } from '../../../domain/entities/User';

export class AuthApi {
    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
    }

    async logout(): Promise<void> {
        await axiosInstance.post('/auth/logout');
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
        return response.data;
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
        await axiosInstance.post('/auth/request-password-reset', data);
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
        await axiosInstance.post('/auth/confirm-password-reset', data);
    }

    async verifyEmail(token: string): Promise<void> {
        await axiosInstance.post('/auth/verify-email', { token });
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await axiosInstance.get('/auth/me');
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        await axiosInstance.post('/auth/update-password', {
            oldPassword,
            newPassword,
        });
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await axiosInstance.patch('/auth/profile', data);
        return response.data;
    }
} 