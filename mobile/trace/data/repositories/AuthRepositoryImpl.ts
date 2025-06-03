import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import { AuthApi } from '@/data/datasources/remote/AuthApi';
import { AppError, NotFoundError, RepositoryError } from '@/shared/errors/AppError';

export class AuthRepositoryImpl implements AuthRepository {
    constructor(private readonly authApi: AuthApi) { }

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens } | AppError> {
        try {
            return await this.authApi.login(credentials);
        } catch (error) {
            throw new RepositoryError(
                'Error logging in',
                'AuthRepository',
                'login',
                error
            );
        }
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens } | AppError> {
        try {
            return await this.authApi.register(data);
        } catch (error) {
            throw new RepositoryError(
                'Error registering',
                'AuthRepository',
                'register',
                error
            );
        }
    }

    async logout(): Promise<void | AppError> {
        try {
            await this.authApi.logout();
        } catch (error) {
            throw new RepositoryError(
                'Error logging out',
                'AuthRepository',
                'logout',
                error
            );
        }
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens | AppError> {
        try {
            return await this.authApi.refreshToken(refreshToken);
        } catch (error) {
            throw new RepositoryError(
                'Error refreshing token',
                'AuthRepository',
                'refreshToken',
                error
            );
        }
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void | AppError> {
        try {
            await this.authApi.requestPasswordReset(data);
        } catch (error) {
            throw new RepositoryError(
                'Error requesting password reset',
                'AuthRepository',
                'requestPasswordReset',
                error
            );
        }
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void | AppError> {
        try {
            await this.authApi.confirmPasswordReset(data);
        } catch (error) {
            throw new RepositoryError(
                'Error confirming password reset',
                'AuthRepository',
                'confirmPasswordReset',
                error
            );
        }
    }

    async verifyEmail(token: string): Promise<void | AppError> {
        try {
            await this.authApi.verifyEmail(token);
        } catch (error) {
            throw new RepositoryError(
                'Error verifying email',
                'AuthRepository',
                'verifyEmail',
                error
            );
        }
    }

    async getCurrentUser(): Promise<User | AppError> {
        try {
            const user = await this.authApi.getCurrentUser();
            if (!user) {
                throw new NotFoundError('User not found');
            }
            return user;
        } catch (error) {
            throw new RepositoryError(
                'Error getting current user',
                'AuthRepository',
                'getCurrentUser',
                error
            );
        }
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError> {
        try {
            await this.authApi.updatePassword(oldPassword, newPassword);
        } catch (error) {
            throw new RepositoryError(
                'Error updating password',
                'AuthRepository',
                'updatePassword',
                error
            );
        }
    }

    async updateProfile(data: Partial<User>): Promise<User | AppError> {
        try {
            return await this.authApi.updateProfile(data);
        } catch (error) {
            throw new RepositoryError(
                'Error updating profile',
                'AuthRepository',
                'updateProfile',
                error
            );
        }
    }
} 