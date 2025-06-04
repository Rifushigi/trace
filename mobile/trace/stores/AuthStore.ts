import { makeAutoObservable, action } from 'mobx';
import { AuthService } from '../domain/services/auth/AuthService';
import { UserService } from '../domain/services/user/UserService';
import { AuthState, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '../domain/entities/Auth';
import { User } from '../domain/entities/User';
import { AuthStorage } from '@/infrastructure/storage/AuthStorage';

export class AuthStore {
    public readonly authService: AuthService;
    public readonly userService: UserService;
    private readonly storage = AuthStorage;

    private authState: AuthState = {
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
    };

    get state(): AuthState {
        return this.authState;
    }

    constructor(authService: AuthService, userService: UserService) {
        this.authService = authService;
        this.userService = userService;
        makeAutoObservable(this);
    }

    private setAuthState = action((newState: Partial<AuthState>) => {
        this.authState = { ...this.authState, ...newState };
    });

    private setLoading = action((loading: boolean) => {
        this.setAuthState({ isLoading: loading });
    });

    private setError = action((error: string | null) => {
        this.setAuthState({ error });
    });

    async login(credentials: LoginCredentials) {
        this.setLoading(true);
        this.setError(null);
        try {
            const result = await this.authService.login(credentials);
            this.setAuthState({
                user: result.user,
                tokens: result.tokens,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred during login');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async register(data: RegisterData) {
        this.setLoading(true);
        this.setError(null);
        try {
            const result = await this.authService.register(data);
            this.setAuthState({
                user: result.user,
                tokens: result.tokens,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred during registration');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        this.setLoading(true);
        this.setError(null);
        try {
            await this.authService.logout();
            this.setAuthState({
                user: null,
                tokens: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred during logout');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async refreshToken() {
        if (!this.authState.tokens?.refreshToken) {
            return;
        }

        this.setLoading(true);
        this.setError(null);
        try {
            const tokens = await this.authService.refreshToken(this.authState.tokens.refreshToken);
            this.setAuthState({
                tokens,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred while refreshing token');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async requestPasswordReset(request: PasswordResetRequest) {
        this.setLoading(true);
        this.setError(null);
        try {
            await this.authService.requestPasswordReset(request);
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred while requesting password reset');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async confirmPasswordReset(confirm: PasswordResetConfirm) {
        this.setLoading(true);
        this.setError(null);
        try {
            await this.authService.confirmPasswordReset(confirm);
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred while confirming password reset');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async verifyEmail(token: string) {
        this.setLoading(true);
        this.setError(null);
        try {
            await this.authService.verifyEmail(token);
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred while verifying email');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async getCurrentUser() {
        this.setLoading(true);
        this.setError(null);
        try {
            // First try to get user from cookie-based session
            const user = await this.authService.getCurrentUser();

            if (user) {
                // If we have a valid cookie session, update state
                this.setAuthState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                return user;
            }

            // If no valid cookie session but we have tokens, try token refresh
            if (this.authState.tokens?.refreshToken) {
                try {
                    await this.refreshToken();
                    // After successful refresh, try getting user again
                    const userAfterRefresh = await this.authService.getCurrentUser();
                    this.setAuthState({
                        user: userAfterRefresh,
                        isAuthenticated: !!userAfterRefresh,
                        isLoading: false,
                        error: null
                    });
                    return userAfterRefresh;
                } catch {
                    // If refresh fails, clear tokens and update state
                    await this.clearStoredTokens();
                    this.setAuthState({
                        user: null,
                        tokens: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
                }
            }

            // No valid session or tokens
            this.setAuthState({
                user: null,
                tokens: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
            return null;
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred while getting current user');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async isAuthenticated() {
        try {
            const user = await this.authService.getCurrentUser();
            if (user) {
                this.setAuthState({
                    user,
                    isAuthenticated: true
                });
                return true;
            }

            // If no valid cookie session but we have tokens, check token validity
            if (this.authState.tokens?.refreshToken) {
                try {
                    await this.refreshToken();
                    return true;
                } catch {
                    await this.clearStoredTokens();
                    return false;
                }
            }

            return false;
        } catch {
            return false;
        }
    }

    async getStoredTokens() {
        // First check if tokens in state are still valid
        if (this.authState.tokens?.refreshToken) {
            try {
                await this.refreshToken();
                return this.authState.tokens;
            } catch {
                await this.clearStoredTokens();
                return null;
            }
        }
        return null;
    }

    async clearStoredTokens() {
        // Clear tokens from state
        this.setAuthState({
            tokens: null,
            isAuthenticated: false
        });

        // Also clear tokens from storage
        await this.storage.removeStoredTokens();

        // Try to logout to clear cookies as well
        try {
            await this.authService.logout();
        } catch (error) {
            console.error('Error clearing cookies during token clear:', error);
        }
    }

    async updatePassword(oldPassword: string, newPassword: string) {
        this.setLoading(true);
        this.setError(null);
        try {
            await this.authService.updatePassword(oldPassword, newPassword);
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred while updating password');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async updateProfile(data: Partial<User>) {
        this.setLoading(true);
        this.setError(null);
        try {
            const updatedUser = await this.authService.updateProfile(data);
            this.setAuthState({
                user: updatedUser,
                isLoading: false,
                error: null
            });
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred while updating profile');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
} 