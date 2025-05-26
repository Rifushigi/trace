import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import { AuthApi } from '@/data/datasources/remote/AuthApi';

export class AuthRepositoryImpl implements AuthRepository {
    constructor(private readonly authApi: AuthApi) { }

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
        return this.authApi.login(credentials);
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
        return this.authApi.register(data);
    }

    async logout(): Promise<void> {
        return this.authApi.logout();
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        return this.authApi.refreshToken(refreshToken);
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
        return this.authApi.requestPasswordReset(data);
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
        return this.authApi.confirmPasswordReset(data);
    }

    async verifyEmail(token: string): Promise<void> {
        return this.authApi.verifyEmail(token);
    }

    async getCurrentUser(): Promise<User | null> {
        return this.authApi.getCurrentUser();
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        return this.authApi.updatePassword(oldPassword, newPassword);
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        return this.authApi.updateProfile(data);
    }
} 