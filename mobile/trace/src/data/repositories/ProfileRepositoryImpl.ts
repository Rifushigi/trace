import { ProfileRepository } from '../../domain/repositories/ProfileRepository';
import { User } from '../../domain/entities/User';
import { ProfileApi } from '../datasources/remote/ProfileApi';

export class ProfileRepositoryImpl implements ProfileRepository {
    constructor(private readonly profileApi: ProfileApi) { }

    async getProfile(): Promise<User> {
        return this.profileApi.getProfile();
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        return this.profileApi.updateProfile(data);
    }

    async updateProfilePicture(imageUri: string): Promise<User> {
        return this.profileApi.updateProfilePicture(imageUri);
    }

    async deleteProfilePicture(): Promise<User> {
        return this.profileApi.deleteProfilePicture();
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        return this.profileApi.updatePassword(oldPassword, newPassword);
    }

    async deleteAccount(): Promise<void> {
        return this.profileApi.deleteAccount();
    }
} 