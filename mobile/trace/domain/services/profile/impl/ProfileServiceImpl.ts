import { ProfileUseCase } from '@/domain/services/profile/ProfileService';
import { User } from '@/domain/entities/User';
import { ProfileRepository } from '@/domain/repositories/ProfileRepository';

export class ProfileUseCaseImpl implements ProfileUseCase {
    constructor(private readonly profileRepository: ProfileRepository) { }

    async getProfile(): Promise<User> {
        return this.profileRepository.getProfile();
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        return this.profileRepository.updateProfile(data);
    }

    async updateProfilePicture(imageUri: string): Promise<User> {
        return this.profileRepository.updateProfilePicture(imageUri);
    }

    async deleteProfilePicture(): Promise<User> {
        return this.profileRepository.deleteProfilePicture();
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        return this.profileRepository.updatePassword(oldPassword, newPassword);
    }

    async deleteAccount(): Promise<void> {
        return this.profileRepository.deleteAccount();
    }
} 