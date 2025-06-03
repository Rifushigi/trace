import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

export interface UserRepository {
    getAllUsers(): Promise<User[] | AppError>;
    deleteUser(userId: string): Promise<void | AppError>;
    verifyUser(userId: string): Promise<void | AppError>;
} 