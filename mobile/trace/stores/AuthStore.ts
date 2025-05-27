import { makeAutoObservable, action, runInAction } from 'mobx';
import { AuthUseCase } from '../domain/usecases/auth/AuthUseCase';
import { ProfileUseCase } from '../domain/usecases/profile/ProfileUseCase';
import { UserUseCase } from '../domain/usecases/user/UserUseCase';
import { AuthState, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '../domain/entities/Auth';
import { User } from '../domain/entities/User';
import { features } from '../config/features';
import { MockAuthApi } from '../data/datasources/mock/MockAuthApi';
import { AuthApi } from '../data/datasources/remote/AuthApi';

export class AuthStore {
    public readonly authUseCase: AuthUseCase;
    public readonly profileUseCase: ProfileUseCase;
    public readonly userUseCase: UserUseCase;
    private authApi: AuthApi | MockAuthApi;
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

    constructor(authUseCase: AuthUseCase, profileUseCase: ProfileUseCase, userUseCase: UserUseCase) {
        this.authUseCase = authUseCase;
        this.profileUseCase = profileUseCase;
        this.userUseCase = userUseCase;
        this.authApi = features.useMockApi ? new MockAuthApi() : new AuthApi();
        makeAutoObservable(this);
    }

    private setAuthState = action((newState: Partial<AuthState>) => {
        this.authState = { ...this.authState, ...newState };
    });

    private setLoading = action((loading: boolean) => {
        this.authState.isLoading = loading;
    });

    private setError = action((error: string | null) => {
        this.authState.error = error;
    });

    async login(credentials: LoginCredentials) {
        this.setLoading(true);
        this.setError(null);
        try {
            const result = await this.authUseCase.login(credentials);
            runInAction(() => {
                this.authState = {
                    user: result.user,
                    tokens: result.tokens,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                };
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
            const result = await this.authUseCase.register(data);
            runInAction(() => {
                this.authState = {
                    user: result.user,
                    tokens: result.tokens,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                };
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
            await this.authUseCase.logout();
            runInAction(() => {
                this.authState = {
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                };
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
            throw new Error('No refresh token available');
        }

        this.setLoading(true);
        this.setError(null);
        try {
            const tokens = await this.authUseCase.refreshToken(this.authState.tokens.refreshToken);
            runInAction(() => {
                this.authState = {
                    ...this.authState,
                    tokens,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                };
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
            await this.authUseCase.requestPasswordReset(request);
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
            await this.authUseCase.confirmPasswordReset(confirm);
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
            await this.authUseCase.verifyEmail(token);
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
            const user = await this.authUseCase.getCurrentUser();

            if (user) {
                // If we have a valid cookie session, update state
                runInAction(() => {
                    this.authState = {
                        ...this.authState,
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    };
                });
                return user;
            }

            // If no valid cookie session but we have tokens, try token refresh
            if (this.authState.tokens?.refreshToken) {
                try {
                    await this.refreshToken();
                    // After successful refresh, try getting user again
                    const userAfterRefresh = await this.authUseCase.getCurrentUser();
                    runInAction(() => {
                        this.authState = {
                            ...this.authState,
                            user: userAfterRefresh,
                            isAuthenticated: !!userAfterRefresh,
                            isLoading: false,
                            error: null
                        };
                    });
                    return userAfterRefresh;
                } catch (refreshError) {
                    // If refresh fails, clear tokens and update state
                    await this.clearStoredTokens();
                    runInAction(() => {
                        this.authState = {
                            user: null,
                            tokens: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null
                        };
                    });
                    return null;
                }
            }

            // No valid session or tokens
            runInAction(() => {
                this.authState = {
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                };
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
            // First check if we have a valid cookie session
            const user = await this.authUseCase.getCurrentUser();
            if (user) {
                runInAction(() => {
                    this.authState = {
                        ...this.authState,
                        user,
                        isAuthenticated: true
                    };
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
        if (this.authState.tokens) {
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
        runInAction(() => {
            this.authState = {
                ...this.authState,
                tokens: null,
                isAuthenticated: false
            };
        });

        // Also clear tokens from storage
        await this.authUseCase.clearStoredTokens();

        // Try to logout to clear cookies as well
        try {
            await this.authUseCase.logout();
        } catch (error) {
            console.error('Error clearing cookies during token clear:', error);
        }
    }

    async updatePassword(oldPassword: string, newPassword: string) {
        this.setLoading(true);
        this.setError(null);
        try {
            await this.authUseCase.updatePassword(oldPassword, newPassword);
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
            const updatedUser = await this.authUseCase.updateProfile(data);
            runInAction(() => {
                this.authState = {
                    ...this.authState,
                    user: updatedUser,
                    isLoading: false,
                    error: null
                };
            });
        } catch (error) {
            this.setError(error instanceof Error ? error.message : 'An error occurred while updating profile');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
} 