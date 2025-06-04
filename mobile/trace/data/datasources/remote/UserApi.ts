import { User, IUserApi } from '@/domain/entities/User';
import { axiosInstance } from '@/infrastructure/network/axiosInstance';
import { AppError } from '@/shared/errors/AppError';

export class UserApi implements IUserApi {
    private readonly BASE_URL = '/users';

    async getAllUsers(): Promise<User[] | AppError> {
        const response = await axiosInstance.get<User[]>(`${this.BASE_URL}`);
        return response.data;
    }

    async deleteUser(userId: string): Promise<void | AppError> {
        await axiosInstance.delete(`${this.BASE_URL}/${userId}`);
    }

    async verifyUser(userId: string): Promise<void | AppError> {
        await axiosInstance.post(`${this.BASE_URL}/${userId}/verify`);
    }

    async getUser(userId: string): Promise<User> {
        const response = await axiosInstance.get<User>(`${this.BASE_URL}/${userId}`);
        return response.data;
    }

    async updateUser(userId: string, user: User): Promise<User> {
        const response = await axiosInstance.put<User>(`${this.BASE_URL}/${userId}`, user);
        return response.data;
    }

    async getProfile(): Promise<User | AppError> {
        const response = await axiosInstance.get<User>(`${this.BASE_URL}/profile`);
        return response.data;
    }

    async updateProfile(data: Partial<User>): Promise<User | AppError> {
        const response = await axiosInstance.put<User>(`${this.BASE_URL}/profile`, data);
        return response.data;
    }

    async updateProfilePicture(imageUri: string): Promise<User | AppError> {
        const formData = new FormData();
        formData.append('avatar', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'avatar.jpg',
        } as any);

        const response = await axiosInstance.post<User>(`${this.BASE_URL}/profile/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async deleteProfilePicture(): Promise<User | AppError> {
        const response = await axiosInstance.delete<User>(`${this.BASE_URL}/profile/avatar`);
        return response.data;
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError> {
        await axiosInstance.post(`${this.BASE_URL}/profile/password`, {
            oldPassword,
            newPassword,
        });
    }

    async deleteAccount(): Promise<void | AppError> {
        await axiosInstance.delete(`${this.BASE_URL}/profile`);
    }
} 