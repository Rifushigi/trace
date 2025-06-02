import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';

export interface AuthUseCase {
    login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }>;
    register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }>;
    logout(): Promise<void>;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    requestPasswordReset(data: PasswordResetRequest): Promise<void>;
    confirmPasswordReset(data: PasswordResetConfirm): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    updatePassword(oldPassword: string, newPassword: string): Promise<void>;
    updateProfile(data: Partial<User>): Promise<User>;
    isAuthenticated(): Promise<boolean>;
    getStoredTokens(): Promise<AuthTokens | null>;
    clearStoredTokens(): Promise<void>;
} 