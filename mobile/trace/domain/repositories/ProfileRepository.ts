import { User } from '../entities/User';

export interface ProfileRepository {
    getProfile(): Promise<User>;
    updateProfile(data: Partial<User>): Promise<User>;
    updateProfilePicture(imageUri: string): Promise<User>;
    deleteProfilePicture(): Promise<User>;
    updatePassword(oldPassword: string, newPassword: string): Promise<void>;
    deleteAccount(): Promise<void>;
} 