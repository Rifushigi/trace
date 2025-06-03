import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

export interface AuthRepository {
    login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens } | AppError>;
    register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens } | AppError>;
    logout(): Promise<void | AppError>;
    refreshToken(refreshToken: string): Promise<AuthTokens | AppError>;
    requestPasswordReset(data: PasswordResetRequest): Promise<void | AppError>;
    confirmPasswordReset(data: PasswordResetConfirm): Promise<void | AppError>;
    verifyEmail(token: string): Promise<void | AppError>;
    getCurrentUser(): Promise<User | AppError>;
    updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError>;
    updateProfile(data: Partial<User>): Promise<User | AppError>;
} 