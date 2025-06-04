import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from './useAuth';
import { UseAuthGuardOptions } from '@/shared/types/auth';

export const useAuthGuard = ({
    redirectTo = '/login',
    requireAuth = true,
}: UseAuthGuardOptions = {}) => {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                router.replace(redirectTo);
            } else if (!requireAuth && isAuthenticated) {
                router.replace('/');
            }
        }
    }, [isAuthenticated, isLoading, requireAuth, redirectTo]);

    return {
        isAuthenticated,
        isLoading,
    };
}; 