import { makeAutoObservable } from 'mobx';
import { ClassUseCase } from '@/domain/usecases/class/ClassUseCase';
import { Class } from '@/domain/entities/Class';

export class ClassStore {
    public readonly classUseCase: ClassUseCase;
    public classes: Class[] = [];
    public isLoading: boolean = false;
    public error: string | null = null;

    constructor(classUseCase: ClassUseCase) {
        this.classUseCase = classUseCase;
        makeAutoObservable(this);
    }

    async getClasses() {
        this.isLoading = true;
        this.error = null;
        try {
            this.classes = await this.classUseCase.getClasses();
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to fetch classes';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async getClass(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
            return await this.classUseCase.getClass(id);
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to fetch class';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) {
        this.isLoading = true;
        this.error = null;
        try {
            const newClass = await this.classUseCase.createClass(data);
            this.classes.push(newClass);
            return newClass;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to create class';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async updateClass(id: string, data: Partial<Class>) {
        this.isLoading = true;
        this.error = null;
        try {
            const updatedClass = await this.classUseCase.updateClass(id, data);
            const index = this.classes.findIndex(c => c.id === id);
            if (index !== -1) {
                this.classes[index] = updatedClass;
            }
            return updatedClass;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to update class';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async deleteClass(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
            await this.classUseCase.deleteClass(id);
            this.classes = this.classes.filter(c => c.id !== id);
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to delete class';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
} 