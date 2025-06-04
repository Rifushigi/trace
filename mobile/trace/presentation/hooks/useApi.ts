import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { withErrorHandling } from '@/shared/errors/errorHandler';
import { UseApiOptions } from '@/shared/types/api';

export const useApi = <T, S>({
    store,
    action,
    onSuccess,
    onError,
    showErrorAlert = true,
}: UseApiOptions<T, S>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<T | null>(null);

    const execute = useCallback(async (...args: any[]) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await withErrorHandling(() => action(store)(...args));
            setData(result);
            onSuccess?.(result);
            return result;
        } catch (err) {
            const error = err as Error;
            setError(error);
            onError?.(error);

            if (showErrorAlert) {
                Alert.alert('Error', error.message);
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [store, action, onSuccess, onError, showErrorAlert]);

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        isLoading,
        error,
        data,
        execute,
        reset,
    };
}; 