import { AppError, NetworkError, AuthError, ValidationError, NotFoundError, ServerError } from '@/shared/errors/AppError';
import { AxiosError, isAxiosError } from 'axios';

interface ErrorResponse {
    message?: string;
    [key: string]: unknown;
}

export const handleError = (error: unknown): AppError => {
    if (error instanceof AppError) {
        return error;
    }

    if (isAxiosError(error)) {
        return handleAxiosError(error);
    }

    if (error instanceof Error) {
        return new ServerError(error.message, 500, error);
    }

    return new ServerError('An unexpected error occurred', 500, error);
};

const handleAxiosError = (error: AxiosError<ErrorResponse>): AppError => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
        case 400:
            return new ValidationError(message, error);
        case 401:
            return new AuthError(message, status, error);
        case 403:
            return new AuthError('Access denied', status, error);
        case 404:
            return new NotFoundError(message, error);
        case 500:
            return new ServerError(message, status, error);
        default:
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                return new NetworkError('No internet connection', error);
            }
            return new ServerError(message || 'Server error', status || 500, error);
    }
};

export const isAppError = (error: unknown): error is AppError => {
    return error instanceof AppError;
};

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AppError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
}; 