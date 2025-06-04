import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { RouteParams } from '@/shared/types/navigation';

export const useRouteParams = <T extends RouteParams>() => {
    const params = useLocalSearchParams();

    // Convert params to the expected type
    const typedParams = useMemo(() => {
        const result: Partial<T> = {};

        Object.entries(params).forEach(([key, value]) => {
            // Handle array values
            if (Array.isArray(value)) {
                result[key as keyof T] = value as any;
            }
            // Handle numeric values
            else if (!isNaN(Number(value))) {
                result[key as keyof T] = Number(value) as any;
            }
            // Handle string values
            else {
                result[key as keyof T] = value as any;
            }
        });

        return result as T;
    }, [params]);

    return typedParams;
}; 