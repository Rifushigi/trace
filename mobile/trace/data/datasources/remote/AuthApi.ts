import { axiosInstance } from '@/infrastructure/network/axiosInstance';
import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm, IAuthApi } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';

export class AuthApi implements IAuthApi {
    readonly BASE_URL = '/auth';

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
        const response = await axiosInstance.post(`${this.BASE_URL}/login`, credentials);
        return response.data;
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
        const response = await axiosInstance.post(`${this.BASE_URL}/register`, data);
        return response.data;
    }

    async logout(): Promise<void> {
        await axiosInstance.post(`${this.BASE_URL}/logout`);
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const response = await axiosInstance.post(`${this.BASE_URL}/refresh-token`, { refreshToken });
        return response.data;
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
        await axiosInstance.post(`${this.BASE_URL}/request-password-reset`, data);
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
        await axiosInstance.post(`${this.BASE_URL}/confirm-password-reset`, data);
    }

    async verifyEmail(token: string): Promise<void> {
        await axiosInstance.post(`${this.BASE_URL}/verify-email`, { token });
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/me`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        await axiosInstance.post(`${this.BASE_URL}/update-password`, {
            oldPassword,
            newPassword,
        });
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await axiosInstance.patch(`${this.BASE_URL}/profile`, data);
        return response.data;
    }
} 