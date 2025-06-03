import { User } from '@/domain/entities/User';

export interface UserService {
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    verifyUser(userId: string): Promise<void>;
    getProfile(): Promise<User>;
    updateProfile(data: Partial<User>): Promise<User>;
    updateProfilePicture(imageUri: string): Promise<User>;
    deleteProfilePicture(): Promise<User>;
    updatePassword(oldPassword: string, newPassword: string): Promise<void>;
    deleteAccount(): Promise<void>;
}