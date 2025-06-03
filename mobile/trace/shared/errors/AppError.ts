export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode?: number,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class NetworkError extends AppError {
    constructor(message = 'Network connection failed', originalError?: unknown) {
        super(message, 'NETWORK_ERROR', 0, originalError);
        this.name = 'NetworkError';
    }
}

export class AuthError extends AppError {
    constructor(message = 'Authentication failed', statusCode = 401, originalError?: unknown) {
        super(message, 'AUTH_ERROR', statusCode, originalError);
        this.name = 'AuthError';
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Invalid input data', originalError?: unknown) {
        super(message, 'VALIDATION_ERROR', 400, originalError);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', originalError?: unknown) {
        super(message, 'NOT_FOUND', 404, originalError);
        this.name = 'NotFoundError';
    }
}

export class ServerError extends AppError {
    constructor(message = 'Internal server error', statusCode = 500, originalError?: unknown) {
        super(message, 'SERVER_ERROR', statusCode, originalError);
        this.name = 'ServerError';
    }
}

export class SettingsError extends AppError {
    constructor(message = 'Settings operation failed', originalError?: unknown) {
        super(message, 'SETTINGS_ERROR', 500, originalError);
        this.name = 'SettingsError';
    }
}

export class AttendanceError extends AppError {
    constructor(message = 'Attendance operation failed', originalError?: unknown) {
        super(message, 'ATTENDANCE_ERROR', 500, originalError);
        this.name = 'AttendanceError';
    }
}

export class ClassError extends AppError {
    constructor(message = 'Class operation failed', originalError?: unknown) {
        super(message, 'CLASS_ERROR', 500, originalError);
        this.name = 'ClassError';
    }
}

export class RepositoryError extends AppError {
    constructor(
        message: string,
        public readonly repository: string,
        public readonly operation: string,
        originalError?: unknown
    ) {
        super(message, 'REPOSITORY_ERROR', 500, originalError);
        this.name = 'RepositoryError';
    }
} 