import { AppError } from "@/shared/errors/AppError";
import { User } from '@/domain/entities/User'

export interface IUserApi {
    getAllUsers(): Promise<User[] | AppError>;
    deleteUser(userId: string): Promise<void | AppError>;
    verifyUser(userId: string): Promise<void | AppError>;
    getProfile(): Promise<User | AppError>;
    updateProfile(data: Partial<User>): Promise<User | AppError>;
    updateProfilePicture(imageUri: string): Promise<User | AppError>;
    deleteProfilePicture(): Promise<User | AppError>;
    updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError>;
    deleteAccount(): Promise<void | AppError>;
}