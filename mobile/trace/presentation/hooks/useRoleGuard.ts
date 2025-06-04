import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from './useAuth';
import { UseRoleGuardOptions } from '@/shared/types/auth';

export const useRoleGuard = ({
    allowedRoles,
    redirectTo = '/login',
}: UseRoleGuardOptions) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.replace(redirectTo);
            } else if (user && !allowedRoles.includes(user.role)) {
                // Redirect to appropriate dashboard based on role
                switch (user.role) {
                    case 'admin':
                        router.replace('/(admin)/dashboard');
                        break;
                    case 'lecturer':
                        router.replace('/(lecturer)/dashboard');
                        break;
                    case 'student':
                        router.replace('/student/(tabs)/dashboard');
                        break;
                    default:
                        router.replace('/');
                }
            }
        }
    }, [isAuthenticated, isLoading, user, allowedRoles, redirectTo]);

    return {
        isAuthorized: user ? allowedRoles.includes(user.role) : false,
        isLoading,
    };
}; 