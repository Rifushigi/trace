import { makeAutoObservable } from 'mobx';
import { ClassUseCase } from '../../domain/usecases/class/ClassUseCase';
import { Class } from '../../domain/entities/Class';
import { ClassError } from '../../shared/errors/AppError';
import { handleError } from '../../shared/errors/errorHandler';

export class ClassViewModel {
    public readonly classUseCase: ClassUseCase;
    public classes: Class[] = [];
    public currentClass: Class | null = null;
    public isLoading: boolean = false;
    public error: ClassError | null = null;

    constructor(classUseCase: ClassUseCase) {
        this.classUseCase = classUseCase;
        makeAutoObservable(this);
    }

    async loadClasses() {
        this.isLoading = true;
        this.error = null;
        try {
            const classes = await this.classUseCase.getClasses();
            this.classes = classes;
        } catch (error) {
            this.error = handleError(error) as ClassError;
            console.error('Failed to load classes:', error);
        } finally {
            this.isLoading = false;
        }
    }

    async getClass(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const classData = await this.classUseCase.getClass(id);
            this.currentClass = classData;
            return classData;
        } catch (error) {
            this.error = handleError(error) as ClassError;
            console.error('Failed to get class:', error);
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
            this.error = handleError(error) as ClassError;
            console.error('Failed to create class:', error);
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
            if (this.currentClass?.id === id) {
                this.currentClass = updatedClass;
            }
            return updatedClass;
        } catch (error) {
            this.error = handleError(error) as ClassError;
            console.error('Failed to update class:', error);
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
            if (this.currentClass?.id === id) {
                this.currentClass = null;
            }
        } catch (error) {
            this.error = handleError(error) as ClassError;
            console.error('Failed to delete class:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async searchClasses(query: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const results = await this.classUseCase.searchClasses(query);
            this.classes = results;
            return results;
        } catch (error) {
            this.error = handleError(error) as ClassError;
            console.error('Failed to search classes:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
} 