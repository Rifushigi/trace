import { AuthRepository } from '../repositories/auth.repository';

export interface LoginParams {
    email: string;
    password: string;
}

export interface RequestPasswordResetParams {
    email: string;
}

export interface ResetPasswordParams {
    token: string;
    newPassword: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
}

export class AuthUseCase {
    constructor(private authRepository: AuthRepository) { }

    async login(params: LoginParams): Promise<User> {
        const user = await this.authRepository.login(params);
        return user;
    }

    async logout(): Promise<void> {
        await this.authRepository.logout();
    }

    async requestPasswordReset(params: RequestPasswordResetParams): Promise<void> {
        await this.authRepository.requestPasswordReset(params);
    }

    async resetPassword(params: ResetPasswordParams): Promise<void> {
        await this.authRepository.resetPassword(params);
    }

    async getCurrentUser(): Promise<User | null> {
        return this.authRepository.getCurrentUser();
    }
} 