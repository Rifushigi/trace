import { UserUseCase } from '@/domain/usecases/user/UserUseCase';
import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/UserRepository';

export class UserUseCaseImpl implements UserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }

    async deleteUser(userId: string): Promise<void> {
        return this.userRepository.deleteUser(userId);
    }

    async verifyUser(userId: string): Promise<void> {
        return this.userRepository.verifyUser(userId);
    }
} 