import { axiosInstance } from '@/infrastructure/network/axiosInstance';
import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm, IAuthApi } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import { handleError } from '@/shared/errors/errorHandler';
import { AppError } from '@/shared/errors/AppError';

export class AuthApi implements IAuthApi {
    readonly BASE_URL = '/auth';

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens } | AppError> {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/login`, credentials);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens } | AppError> {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/register`, data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async logout(): Promise<void | AppError> {
        try {
            await axiosInstance.post(`${this.BASE_URL}/logout`);
        } catch (error) {
            return handleError(error);
        }
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens | AppError> {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/refresh-token`, { refreshToken });
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void | AppError> {
        try {
            await axiosInstance.post(`${this.BASE_URL}/request-password-reset`, data);
        } catch (error) {
            return handleError(error);
        }
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void | AppError> {
        try {
            await axiosInstance.post(`${this.BASE_URL}/confirm-password-reset`, data);
        } catch (error) {
            return handleError(error);
        }
    }

    async verifyEmail(token: string): Promise<void | AppError> {
        try {
            await axiosInstance.post(`${this.BASE_URL}/verify-email`, { token });
        } catch (error) {
            return handleError(error);
        }
    }

    async getCurrentUser(): Promise<User | null | AppError> {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/me`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError> {
        try {
            await axiosInstance.post(`${this.BASE_URL}/update-password`, {
                oldPassword,
                newPassword,
            });
        } catch (error) {
            return handleError(error);
        }
    }

    async updateProfile(data: Partial<User>): Promise<User | AppError> {
        try {
            const response = await axiosInstance.patch(`${this.BASE_URL}/profile`, data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }
} 