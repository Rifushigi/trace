import { UseRefreshOptions } from '@/shared/types/refresh';
import { useState, useCallback } from 'react';

export const useRefresh = ({ onRefresh, initialRefreshing = false }: UseRefreshOptions) => {
    const [refreshing, setRefreshing] = useState(initialRefreshing);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setRefreshing(false);
        }
    }, [onRefresh]);

    return {
        refreshing,
        handleRefresh,
    };
}; 