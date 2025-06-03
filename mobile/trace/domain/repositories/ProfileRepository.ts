import { User } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';

export interface ProfileRepository {
    getProfile(): Promise<User | AppError>;
    updateProfile(data: Partial<User>): Promise<User | AppError>;
    updateProfilePicture(imageUri: string): Promise<User | AppError>;
    deleteProfilePicture(): Promise<User | AppError>;
    updatePassword(oldPassword: string, newPassword: string): Promise<void>;
    deleteAccount(): Promise<void>;
} 