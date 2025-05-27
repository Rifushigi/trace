import { User } from '../../entities/User';

export interface UserUseCase {
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