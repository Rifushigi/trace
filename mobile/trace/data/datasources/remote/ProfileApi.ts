import { User } from '@/domain/entities/User';
import { axiosInstance } from '@/infrastructure/network/axiosInstance';

export class ProfileApi {
    private readonly BASE_URL = '/profile';

    async getProfile(): Promise<User> {
        const response = await axiosInstance.get<User>(`${this.BASE_URL}`);
        return response.data;
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await axiosInstance.patch<User>(`${this.BASE_URL}`, data);
        return response.data;
    }

    async updateProfilePicture(imageUri: string): Promise<User> {
        const formData = new FormData();
        formData.append('avatar', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'avatar.jpg',
        } as any);

        const response = await axiosInstance.post<User>(`${this.BASE_URL}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async deleteProfilePicture(): Promise<User> {
        const response = await axiosInstance.delete<User>(`${this.BASE_URL}/avatar`);
        return response.data;
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        await axiosInstance.post(`${this.BASE_URL}/password`, {
            oldPassword,
            newPassword,
        });
    }

    async deleteAccount(): Promise<void> {
        await axiosInstance.delete(`${this.BASE_URL}`);
    }
} 