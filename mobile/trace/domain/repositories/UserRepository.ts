import { User } from '../entities/User';

export interface IUserApi {
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    verifyUser(userId: string): Promise<void>;
}

export interface UserRepository {
    /**
     * Get all users
     */
    getAllUsers(): Promise<User[]>;

    /**
     * Delete a user
     */
    deleteUser(userId: string): Promise<void>;

    /**
     * Verify a user
     */
    verifyUser(userId: string): Promise<void>;
} 