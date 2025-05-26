import { User } from '../../entities/User';

export interface ProfileUseCase {
    /**
     * Get the current user's profile
     */
    getProfile(): Promise<User>;

    /**
     * Update the user's profile information
     */
    updateProfile(data: Partial<User>): Promise<User>;

    /**
     * Update the user's profile picture
     */
    updateProfilePicture(imageUri: string): Promise<User>;

    /**
     * Delete the user's profile picture
     */
    deleteProfilePicture(): Promise<User>;

    /**
     * Update the user's password
     */
    updatePassword(oldPassword: string, newPassword: string): Promise<void>;

    /**
     * Delete the user's account
     */
    deleteAccount(): Promise<void>;
} 