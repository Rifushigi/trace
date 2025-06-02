import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'lecturer' | 'admin';
    // Additional fields based on role
    matricNo?: string;
    program?: string;
    level?: string;
    staffId?: string;
    college?: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    token: string;
    newPassword: string;
}

export interface IAuthApi {
    login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens } | AppError>;
    register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens } | null | AppError>;
    logout(): Promise<void | AppError>;
    refreshToken(refreshToken: string): Promise<AuthTokens | AppError>;
    requestPasswordReset(data: PasswordResetRequest): Promise<void | AppError>;
    confirmPasswordReset(data: PasswordResetConfirm): Promise<void | AppError>;
    verifyEmail(token: string): Promise<void | AppError>;
    getCurrentUser(): Promise<User | null | AppError>;
    updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError>;
    updateProfile(data: Partial<User>): Promise<User | AppError>;
}