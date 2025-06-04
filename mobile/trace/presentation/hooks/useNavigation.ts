import { RoutePath, RouteParams } from '@/shared/types/navigation';
import { useRouter, usePathname } from 'expo-router';
import { useCallback } from 'react';

export const useNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navigate = useCallback((path: RoutePath, params?: RouteParams) => {
        router.push({
            pathname: path,
            params,
        });
    }, [router]);

    const replace = useCallback((path: RoutePath, params?: RouteParams) => {
        router.replace({
            pathname: path,
            params,
        });
    }, [router]);

    const goBack = useCallback(() => {
        router.back();
    }, [router]);

    const canGoBack = useCallback(() => {
        return router.canGoBack();
    }, [router]);

    return {
        // State
        currentPath: pathname,

        // Operations
        navigate,
        replace,
        goBack,
        canGoBack,
    };
}; 