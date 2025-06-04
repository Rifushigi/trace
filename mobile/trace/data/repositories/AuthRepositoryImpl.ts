import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm, IAuthApi } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { AppError, NotFoundError, RepositoryError } from '@/shared/errors/AppError';

export class AuthRepositoryImpl implements AuthRepository {
    constructor(private readonly api: IAuthApi) { }

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens } | AppError> {
        try {
            return await this.api.login(credentials);
        } catch (error) {
            throw new RepositoryError('Failed to login', 'AuthRepository', 'login', error as Error);
        }
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens } | AppError> {
        try {
            const result = await this.api.register(data);
            if (!result) {
                throw new RepositoryError('Registration failed', 'AuthRepository', 'register');
            }
            return result;
        } catch (error) {
            throw new RepositoryError('Failed to register', 'AuthRepository', 'register', error as Error);
        }
    }

    async logout(): Promise<void | AppError> {
        try {
            await this.api.logout();
        } catch (error) {
            throw new RepositoryError('Failed to logout', 'AuthRepository', 'logout', error as Error);
        }
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens | AppError> {
        try {
            return await this.api.refreshToken(refreshToken);
        } catch (error) {
            throw new RepositoryError('Failed to refresh token', 'AuthRepository', 'refreshToken', error as Error);
        }
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void | AppError> {
        try {
            await this.api.requestPasswordReset(data);
        } catch (error) {
            throw new RepositoryError('Failed to request password reset', 'AuthRepository', 'requestPasswordReset', error as Error);
        }
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void | AppError> {
        try {
            await this.api.confirmPasswordReset(data);
        } catch (error) {
            throw new RepositoryError('Failed to confirm password reset', 'AuthRepository', 'confirmPasswordReset', error as Error);
        }
    }

    async verifyEmail(token: string): Promise<void | AppError> {
        try {
            await this.api.verifyEmail(token);
        } catch (error) {
            throw new RepositoryError('Failed to verify email', 'AuthRepository', 'verifyEmail', error as Error);
        }
    }

    async getCurrentUser(): Promise<User | AppError> {
        try {
            const user = await this.api.getCurrentUser();
            if (!user) {
                throw new NotFoundError('User not found');
            }
            return user;
        } catch (error) {
            throw new RepositoryError('Failed to get current user', 'AuthRepository', 'getCurrentUser', error as Error);
        }
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError> {
        try {
            await this.api.updatePassword(oldPassword, newPassword);
        } catch (error) {
            throw new RepositoryError('Failed to update password', 'AuthRepository', 'updatePassword', error as Error);
        }
    }

    async updateProfile(data: Partial<User>): Promise<User | AppError> {
        try {
            return await this.api.updateProfile(data);
        } catch (error) {
            throw new RepositoryError('Failed to update profile', 'AuthRepository', 'updateProfile', error as Error);
        }
    }
} 