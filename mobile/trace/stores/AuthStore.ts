import { makeAutoObservable } from 'mobx';
import { AuthUseCase } from '../domain/usecases/auth/AuthUseCase';
import { ProfileUseCase } from '../domain/usecases/profile/ProfileUseCase';
import { AuthState, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '../domain/entities/Auth';
import { User } from '../domain/entities/User';

export class AuthStore {
    public readonly authUseCase: AuthUseCase;
    public readonly profileUseCase: ProfileUseCase;
    public authState: AuthState = {
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
    };

    constructor(authUseCase: AuthUseCase, profileUseCase: ProfileUseCase) {
        this.authUseCase = authUseCase;
        this.profileUseCase = profileUseCase;
        makeAutoObservable(this);
    }

    async login(credentials: LoginCredentials) {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            const result = await this.authUseCase.login(credentials);
            this.authState = {
                user: result.user,
                tokens: result.tokens,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred during login';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async register(data: RegisterData) {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            const result = await this.authUseCase.register(data);
            this.authState = {
                user: result.user,
                tokens: result.tokens,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred during registration';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async logout() {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            await this.authUseCase.logout();
            this.authState = {
                user: null,
                tokens: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred during logout';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async refreshToken() {
        if (!this.authState.tokens?.refreshToken) {
            throw new Error('No refresh token available');
        }

        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            const tokens = await this.authUseCase.refreshToken(this.authState.tokens.refreshToken);
            this.authState = {
                ...this.authState,
                tokens,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred while refreshing token';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async requestPasswordReset(request: PasswordResetRequest) {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            await this.authUseCase.requestPasswordReset(request);
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred while requesting password reset';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async confirmPasswordReset(confirm: PasswordResetConfirm) {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            await this.authUseCase.confirmPasswordReset(confirm);
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred while confirming password reset';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async verifyEmail(token: string) {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            await this.authUseCase.verifyEmail(token);
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred while verifying email';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async updatePassword(oldPassword: string, newPassword: string) {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            await this.authUseCase.updatePassword(oldPassword, newPassword);
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred while updating password';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async updateProfile(data: Partial<User>) {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            const updatedUser = await this.authUseCase.updateProfile(data);
            this.authState = {
                ...this.authState,
                user: updatedUser,
                isLoading: false,
                error: null
            };
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred while updating profile';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async getCurrentUser() {
        this.authState.isLoading = true;
        this.authState.error = null;
        try {
            const user = await this.authUseCase.getCurrentUser();
            this.authState = {
                ...this.authState,
                user,
                isAuthenticated: !!user,
                isLoading: false,
                error: null
            };
            return user;
        } catch (error) {
            this.authState.error = error instanceof Error ? error.message : 'An error occurred while getting current user';
            throw error;
        } finally {
            this.authState.isLoading = false;
        }
    }

    async isAuthenticated() {
        return this.authState.isAuthenticated;
    }

    async getStoredTokens() {
        return this.authState.tokens;
    }

    async clearStoredTokens() {
        this.authState = {
            ...this.authState,
            tokens: null,
            isAuthenticated: false
        };
    }
} 