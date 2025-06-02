import { User } from '@/domain/entities/User';
import { axiosInstance } from '@/infrastructure/network/axiosInstance';

export class UserApi {
    private readonly BASE_URL = '/users';

    async getAllUsers(): Promise<User[]> {
        const response = await axiosInstance.get<User[]>(`${this.BASE_URL}`);
        return response.data;
    }

    async deleteUser(userId: string): Promise<void> {
        await axiosInstance.delete(`${this.BASE_URL}/${userId}`);
    }

    async verifyUser(userId: string): Promise<void> {
        await axiosInstance.post(`${this.BASE_URL}/${userId}/verify`);
    }
} 