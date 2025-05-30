import { User } from '../entities/User';

export interface UserRepository {
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    verifyUser(userId: string): Promise<void>;
} 