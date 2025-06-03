import { ProfileRepository } from '@/domain/repositories/ProfileRepository';
import { User } from '@/domain/entities/User';
import { ProfileApi } from '@/data/datasources/remote/ProfileApi';
import { AppError, RepositoryError } from '@/shared/errors/AppError';

export class ProfileRepositoryImpl implements ProfileRepository {
    constructor(private readonly profileApi: ProfileApi) { }

    async getProfile(): Promise<User | AppError> {
        try {
            return await this.profileApi.getProfile();
        } catch (error) {
            throw new RepositoryError(
                'Error getting profile',
                'ProfileRepository',
                'getProfile',
                error
            );
        }
    }

    async updateProfile(data: Partial<User>): Promise<User | AppError> {
        try {
            return await this.profileApi.updateProfile(data);
        } catch (error) {
            throw new RepositoryError(
                'Error updating profile',
                'ProfileRepository',
                'updateProfile',
                error
            );
        }
    }

    async updateProfilePicture(imageUri: string): Promise<User | AppError> {
        try {
            return await this.profileApi.updateProfilePicture(imageUri);
        } catch (error) {
            throw new RepositoryError(
                'Error updating profile picture',
                'ProfileRepository',
                'updateProfilePicture',
                error
            );
        }
    }

    async deleteProfilePicture(): Promise<User | AppError> {
        try {
            return await this.profileApi.deleteProfilePicture();
        } catch (error) {
            throw new RepositoryError(
                'Error deleting profile picture',
                'ProfileRepository',
                'deleteProfilePicture',
                error
            );
        }
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError> {
        try {
            await this.profileApi.updatePassword(oldPassword, newPassword);
        } catch (error) {
            throw new RepositoryError(
                'Error updating password',
                'ProfileRepository',
                'updatePassword',
                error
            );
        }
    }

    async deleteAccount(): Promise<void | AppError> {
        try {
            await this.profileApi.deleteAccount();
        } catch (error) {
            throw new RepositoryError(
                'Error deleting account',
                'ProfileRepository',
                'deleteAccount',
                error
            );
        }
    }
} 