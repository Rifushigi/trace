import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { env } from '../config/index.js';
import { validationResult } from 'express-validator';
import { AxiosError } from 'axios';
import { AuthenticatedRequest } from '../types/index.js';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational: boolean = true,
        public details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string, details?: any) {
        super(500, message, true, details);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(400, message, true, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(401, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden') {
        super(401, message);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message);
    }
}

export class JWTError extends AppError {
    constructor(message: string) {
        super(500, message);
    }
}

export class ValueError extends AppError {
    constructor(message: string, details?: any) {
        super(500, message, true, details);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication failed") {
        super(401, message);
    }
}

export class SessionError extends AppError {
    constructor(message: string, details?: any) {
        super(401, message, true, details);
    }
}

export const globalErrorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: false,
            message: err.message,
            ...(err.details != undefined && { details: err.details }),
            ...(env === 'development' && { stack: err.stack })
        });
        return;
    }

    res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        ...(env === 'development' && { stack: err.stack })
    });

    return;
}

export const asyncErrorHandler = <T extends Request>(func: (req: T, res: Response) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(func(req as T, res)).catch(next);

export const middlewareErrorHandler = <T extends Request | AuthenticatedRequest>(func: (req: T, res: Response, next: NextFunction) => Promise<any>) =>
    (req: T, res: Response, next: NextFunction) =>
        Promise.resolve(func(req, res, next)).catch(next);

export function validationErrorHandler(req: Request, _res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ValidationError("validation failed", errorMessages);
    }
    next();
}

// Error handling for ML service calls
export const handleMLError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        if (error.response) {
            // Server responded with error
            if (error.response.status === 401 || error.response.status === 403) {
                throw new AuthenticationError("ML Service authentication failed");
            }
            if (error.response.status === 404) {
                throw new NotFoundError("ML Service resource not found");
            }
            if (error.response.status === 400) {
                throw new AppError(400, "Invalid biometric data");
            }
            throw new AppError(500, "ML Service error");
        } else if (error.request) {
            // No response received
            throw new AppError(503, "ML Service is not responding");
        } else {
            // Request setup error
            throw new AppError(500, "Failed to communicate with ML Service");
        }
    }
    throw new AppError(500, "Unknown ML Service error");
};