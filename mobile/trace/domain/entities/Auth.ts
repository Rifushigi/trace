import { User } from '@/domain/entities/User';

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
}