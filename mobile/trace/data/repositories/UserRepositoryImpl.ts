import { User, IUserApi } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/UserRepository';

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly api: IUserApi) { }

    async getAllUsers(): Promise<User[]> {
        return this.api.getAllUsers();
    }

    async deleteUser(userId: string): Promise<void> {
        return this.api.deleteUser(userId);
    }

    async verifyUser(userId: string): Promise<void> {
        return this.api.verifyUser(userId);
    }
} 