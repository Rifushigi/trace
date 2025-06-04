import {
    AppError,
    NetworkError,
    AuthError,
    ValidationError,
    NotFoundError,
    ServerError
} from '@/shared/errors/AppError';


export interface UseErrorHandlerOptions {
    showErrorAlert?: boolean;
    onError?: (error: AppError) => void;
    onNetworkError?: (error: NetworkError) => void;
    onAuthError?: (error: AuthError) => void;
    onValidationError?: (error: ValidationError) => void;
    onNotFoundError?: (error: NotFoundError) => void;
    onServerError?: (error: ServerError) => void;
}