import { useCallback } from 'react';
import { useStores } from '@/stores';
import { LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '@/domain/entities/Auth';
import { User } from '@/domain/entities/User';
import { useApi } from './useApi';
import { AuthStore } from '@/stores/AuthStore';
import { AuthError } from '@/shared/errors/AppError';

export const useAuth = () => {
    const { authStore } = useStores();

    const { execute: login, isLoading: isLoggingIn, error: loginError } = useApi<{ user: User }, AuthStore>({
        store: authStore,
        action: (store) => async (credentials: LoginCredentials) => {
            await store.login(credentials);
            return { user: store.state.user! };
        },
    });

    const { execute: register, isLoading: isRegistering, error: registerError } = useApi<{ user: User }, AuthStore>({
        store: authStore,
        action: (store) => async (data: RegisterData) => {
            await store.register(data);
            return { user: store.state.user! };
        },
    });

    const { execute: logout, isLoading: isLoggingOut, error: logoutError } = useApi<void, AuthStore>({
        store: authStore,
        action: (store) => () => store.logout(),
    });

    const { execute: requestPasswordReset, isLoading: isRequestingReset, error: resetRequestError } = useApi<void, AuthStore>({
        store: authStore,
        action: (store) => (request: PasswordResetRequest) => store.requestPasswordReset(request),
    });

    const { execute: confirmPasswordReset, isLoading: isConfirmingReset, error: resetConfirmError } = useApi<void, AuthStore>({
        store: authStore,
        action: (store) => (confirm: PasswordResetConfirm) => store.confirmPasswordReset(confirm),
    });

    const { execute: updatePassword, isLoading: isUpdatingPassword, error: updatePasswordError } = useApi<void, AuthStore>({
        store: authStore,
        action: (store) => ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
            store.updatePassword(oldPassword, newPassword),
    });

    const { execute: updateProfile, isLoading: isUpdatingProfile, error: updateProfileError } = useApi<User, AuthStore>({
        store: authStore,
        action: (store) => async (data: Partial<User>) => {
            await store.updateProfile(data);
            return store.state.user!;
        },
    });

    const refreshToken = useCallback(async () => {
        try {
            await authStore.refreshToken();
            return true;
        } catch (error) {
            if (error instanceof AuthError) {
                return false;
            }
            throw error;
        }
    }, [authStore]);

    const getCurrentUser = useCallback(async () => {
        try {
            return await authStore.getCurrentUser();
        } catch (error) {
            if (error instanceof AuthError) {
                return null;
            }
            throw error;
        }
    }, [authStore]);

    return {
        // State
        user: authStore.state.user,
        isAuthenticated: authStore.state.isAuthenticated,
        isLoading: authStore.state.isLoading,

        // Loading States
        isLoggingIn,
        isRegistering,
        isLoggingOut,
        isRequestingReset,
        isConfirmingReset,
        isUpdatingPassword,
        isUpdatingProfile,

        // Error States
        loginError,
        registerError,
        logoutError,
        resetRequestError,
        resetConfirmError,
        updatePasswordError,
        updateProfileError,

        // Operations
        login,
        register,
        logout,
        requestPasswordReset,
        confirmPasswordReset,
        updatePassword,
        updateProfile,
        refreshToken,
        getCurrentUser,
    };
}; 