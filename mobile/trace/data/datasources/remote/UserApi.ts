import { User } from '../../../domain/entities/User';
import { IUserApi } from '../../../domain/repositories/UserRepository';
import { axiosInstance } from '../../../infrastructure/network/axiosInstance';

export class UserApi implements IUserApi {
    private readonly BASE_URL = '/api/users';

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