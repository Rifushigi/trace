import { AuthRepository } from '../../core/domain/repositories/auth.repository';
import { LoginParams, RequestPasswordResetParams, ResetPasswordParams, User } from '../../core/domain/usecases/auth.usecase';
import { api } from '../api';

export class AuthRepositoryImpl implements AuthRepository {
    async login(params: LoginParams): Promise<User> {
        const response = await api.post('/auth/login', params);
        return response.data;
    }

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    }

    async requestPasswordReset(params: RequestPasswordResetParams): Promise<void> {
        await api.post('/auth/request-password-reset', params);
    }

    async resetPassword(params: ResetPasswordParams): Promise<void> {
        await api.post('/auth/reset-password', params);
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            return null;
        }
    }
} 