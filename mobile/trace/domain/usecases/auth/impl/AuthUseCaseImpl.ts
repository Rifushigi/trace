import { AuthUseCase } from '../AuthUseCase';
import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';

// orchestration entities and validation logic
export class AuthUseCaseImpl implements AuthUseCase {
    constructor(private readonly authRepository: AuthRepository) { }

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
        const result = await this.authRepository.login(credentials);
        await this.storeTokens(result.tokens);
        return result;
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
        const result = await this.authRepository.register(data);
        await this.storeTokens(result.tokens);
        return result;
    }

    async logout(): Promise<void> {
        await this.authRepository.logout();
        await this.clearStoredTokens();
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const tokens = await this.authRepository.refreshToken(refreshToken);
        await this.storeTokens(tokens);
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
        return this.authRepository.getCurrentUser();
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        await this.authRepository.updatePassword(oldPassword, newPassword);
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        return this.authRepository.updateProfile(data);
    }

    async isAuthenticated(): Promise<boolean> {
        const user = await this.getCurrentUser();
        return !!user;
    }

    async getStoredTokens(): Promise<AuthTokens | null> {
        const tokensJson = await AsyncStorage.getItem('auth_tokens');
        return tokensJson ? JSON.parse(tokensJson) : null;
    }

    async clearStoredTokens(): Promise<void> {
        await AsyncStorage.removeItem('auth_tokens');
    }

    private async storeTokens(tokens: AuthTokens): Promise<void> {
        await AsyncStorage.setItem('auth_tokens', JSON.stringify(tokens));
    }
} 