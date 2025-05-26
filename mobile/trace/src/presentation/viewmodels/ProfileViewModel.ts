import { makeAutoObservable } from 'mobx';
import { ProfileUseCase } from '../../domain/usecases/profile/ProfileUseCase';
import { User } from '../../domain/entities/User';

export class ProfileViewModel {
    private _user: User | null = null;
    private _isLoading = false;
    private _error: string | null = null;

    constructor(private readonly profileUseCase: ProfileUseCase) {
        makeAutoObservable(this);
    }

    get user(): User | null {
        return this._user;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get error(): string | null {
        return this._error;
    }

    async loadProfile(): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._user = await this.profileUseCase.getProfile();
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to load profile';
        } finally {
            this._isLoading = false;
        }
    }

    async updateProfile(data: Partial<User>): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._user = await this.profileUseCase.updateProfile(data);
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to update profile';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async updateProfilePicture(imageUri: string): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._user = await this.profileUseCase.updateProfilePicture(imageUri);
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to update profile picture';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async deleteProfilePicture(): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._user = await this.profileUseCase.deleteProfilePicture();
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to delete profile picture';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            await this.profileUseCase.updatePassword(oldPassword, newPassword);
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to update password';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async deleteAccount(): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            await this.profileUseCase.deleteAccount();
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to delete account';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    clearError(): void {
        this._error = null;
    }
} 