import { User, IUserApi } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { AppError, RepositoryError } from '@/shared/errors/AppError';

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly api: IUserApi) { }

    async getAllUsers(): Promise<User[] | AppError> {
        try {
            return await this.api.getAllUsers();
        } catch (error) {
            throw new RepositoryError(
                'Error getting all users',
                'UserRepository',
                'getAllUsers',
                error
            );
        }
    }

    async deleteUser(userId: string): Promise<void | AppError> {
        try {
            await this.api.deleteUser(userId);
        } catch (error) {
            throw new RepositoryError(
                'Error deleting user',
                'UserRepository',
                'deleteUser',
                error
            );
        }
    }

    async verifyUser(userId: string): Promise<void | AppError> {
        try {
            await this.api.verifyUser(userId);
        } catch (error) {
            throw new RepositoryError(
                'Error verifying user',
                'UserRepository',
                'verifyUser',
                error
            );
        }
    }

    async getProfile(): Promise<User | AppError> {
        try {
            return await this.api.getProfile();
        } catch (error) {
            throw new RepositoryError(
                'Error getting profile',
                'UserRepository',
                'getProfile',
                error
            );
        }
    }

    async updateProfile(data: Partial<User>): Promise<User | AppError> {
        try {
            return await this.api.updateProfile(data);
        } catch (error) {
            throw new RepositoryError(
                'Error updating profile',
                'UserRepository',
                'updateProfile',
                error
            );
        }
    }

    async updateProfilePicture(imageUri: string): Promise<User | AppError> {
        try {
            return await this.api.updateProfilePicture(imageUri);
        } catch (error) {
            throw new RepositoryError(
                'Error updating profile picture',
                'UserRepository',
                'updateProfilePicture',
                error
            );
        }
    }

    async deleteProfilePicture(): Promise<User | AppError> {
        try {
            return await this.api.deleteProfilePicture();
        } catch (error) {
            throw new RepositoryError(
                'Error deleting profile picture',
                'UserRepository',
                'deleteProfilePicture',
                error
            );
        }
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError> {
        try {
            await this.api.updatePassword(oldPassword, newPassword);
        } catch (error) {
            throw new RepositoryError(
                'Error updating password',
                'UserRepository',
                'updatePassword',
                error
            );
        }
    }

    async deleteAccount(): Promise<void | AppError> {
        try {
            await this.api.deleteAccount();
        } catch (error) {
            throw new RepositoryError(
                'Error deleting account',
                'UserRepository',
                'deleteAccount',
                error
            );
        }
    }
} 