import { User, IUserApi } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { AppError, RepositoryError } from '@/shared/errors/AppError';

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly api: IUserApi) { }

    async getAllUsers(): Promise<User[] | AppError> {
        try {
            return await this.api.getAllUsers();
        } catch (error) {
            throw new RepositoryError(
                'Error getting all users',
                'UserRepository',
                'getAllUsers',
                error
            );
        }
    }

    async deleteUser(userId: string): Promise<void | AppError> {
        try {
            await this.api.deleteUser(userId);
        } catch (error) {
            throw new RepositoryError(
                'Error deleting user',
                'UserRepository',
                'deleteUser',
                error
            );
        }
    }

    async verifyUser(userId: string): Promise<void | AppError> {
        try {
            await this.api.verifyUser(userId);
        } catch (error) {
            throw new RepositoryError(
                'Error verifying user',
                'UserRepository',
                'verifyUser',
                error
            );
        }
    }
} 