import { LoginParams, RequestPasswordResetParams, ResetPasswordParams, User } from '../usecases/auth.usecase';

export interface AuthRepository {
    login(params: LoginParams): Promise<User>;
    logout(): Promise<void>;
    requestPasswordReset(params: RequestPasswordResetParams): Promise<void>;
    resetPassword(params: ResetPasswordParams): Promise<void>;
    getCurrentUser(): Promise<User | null>;
} 