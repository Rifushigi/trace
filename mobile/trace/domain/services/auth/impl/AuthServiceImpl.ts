import { AuthService } from '@/domain/services/auth/AuthService';
import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';
import { AuthStorage } from '@/infrastructure/storage/AuthStorage';

// orchestration entities and validation logic
export class AuthServiceImpl implements AuthService {
    constructor(private readonly authRepository: AuthRepository) { }
    private readonly storage = AuthStorage;

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
        const result = await this.authRepository.login(credentials);
        if (result instanceof AppError) {
            throw result;
        }
        await this.storage.storeTokens(result.tokens);
        return result;
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
        const result = await this.authRepository.register(data);
        if (result instanceof AppError) {
            throw result;
        }
        await this.storage.storeTokens(result.tokens);
        return result;
    }

    async logout(): Promise<void> {
        await this.authRepository.logout();
        await this.storage.removeStoredTokens();
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const tokens = await this.authRepository.refreshToken(refreshToken);
        if (tokens instanceof AppError) {
            throw tokens;
        }
        await this.storage.storeTokens(tokens);
        return tokens;
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
        await this.authRepository.requestPasswordReset(data);
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
        await this.authRepository.confirmPasswordReset(data);
    }

    async verifyEmail(token: string): Promise<void> {
        await this.authRepository.verifyEmail(token);
    }

    async getCurrentUser(): Promise<User | null> {
        const result = await this.authRepository.getCurrentUser();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        await this.authRepository.updatePassword(oldPassword, newPassword);
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        const result = await this.authRepository.updateProfile(data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async isAuthenticated(): Promise<boolean> {
        const user = await this.getCurrentUser();
        return !!user;
    }
} 