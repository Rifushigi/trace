import { UserService } from '@/domain/services/user/UserService';
import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { AppError } from '@/shared/errors/AppError';

export class UserServiceImpl implements UserService {
    constructor(private readonly repository: UserRepository) { }

    async getAllUsers(): Promise<User[]> {
        const result = await this.repository.getAllUsers();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async deleteUser(userId: string): Promise<void> {
        const result = await this.repository.deleteUser(userId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async verifyUser(userId: string): Promise<void> {
        const result = await this.repository.verifyUser(userId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async getProfile(): Promise<User> {
        const result = await this.repository.getProfile();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        const result = await this.repository.updateProfile(data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updateProfilePicture(imageUri: string): Promise<User> {
        const result = await this.repository.updateProfilePicture(imageUri);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async deleteProfilePicture(): Promise<User> {
        const result = await this.repository.deleteProfilePicture();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        const result = await this.repository.updatePassword(oldPassword, newPassword);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async deleteAccount(): Promise<void> {
        const result = await this.repository.deleteAccount();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }
} 