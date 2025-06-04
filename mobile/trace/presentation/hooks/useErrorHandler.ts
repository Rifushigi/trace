import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { AppError, NetworkError, AuthError, ValidationError, NotFoundError, ServerError } from '@/shared/errors/AppError';
import { handleError, withErrorHandling } from '@/shared/errors/errorHandler';
import { UseErrorHandlerOptions } from '@/shared/types/error';
import { useNetworkStatus } from './useNetworkStatus';

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
    const [error, setError] = useState<AppError | null>(null);
    const [isHandlingError, setIsHandlingError] = useState(false);
    const { isConnected, isInternetReachable } = useNetworkStatus();

    const handleErrorWithOptions = useCallback(async <T>(
        operation: () => Promise<T>,
        errorMessage?: string
    ): Promise<T> => {
        setIsHandlingError(true);
        setError(null);

        // Check network status before attempting operation
        if (!isConnected || !isInternetReachable) {
            const networkError = new NetworkError('No internet connection available');
            setError(networkError);

            if (options.onNetworkError) {
                options.onNetworkError(networkError);
            }

            if (options.showErrorAlert) {
                Alert.alert('Network Error', 'Please check your internet connection');
            }

            throw networkError;
        }

        try {
            return await withErrorHandling(operation, errorMessage);
        } catch (err) {
            const appError = handleError(err);
            setError(appError);

            // Call specific error handlers
            if (appError instanceof NetworkError && options.onNetworkError) {
                options.onNetworkError(appError);
            } else if (appError instanceof AuthError && options.onAuthError) {
                options.onAuthError(appError);
            } else if (appError instanceof ValidationError && options.onValidationError) {
                options.onValidationError(appError);
            } else if (appError instanceof NotFoundError && options.onNotFoundError) {
                options.onNotFoundError(appError);
            } else if (appError instanceof ServerError && options.onServerError) {
                options.onServerError(appError);
            }

            // Call general error handler
            options.onError?.(appError);

            // Show error alert if enabled
            if (options.showErrorAlert) {
                Alert.alert('Error', appError.message);
            }

            throw appError;
        } finally {
            setIsHandlingError(false);
        }
    }, [options, isConnected, isInternetReachable]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const getErrorMessage = useCallback((error: unknown): string => {
        if (error instanceof AppError) {
            return error.message;
        }
        if (error instanceof Error) {
            return error.message;
        }
        return 'An unexpected error occurred';
    }, []);

    return {
        // State
        error,
        isHandlingError,
        isConnected,
        isInternetReachable,

        // Operations
        handleError: handleErrorWithOptions,
        clearError,
        getErrorMessage,
    };
}; 