import { User } from '@/domain/entities/User';

export interface UserUseCase {
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    verifyUser(userId: string): Promise<void>;
} 