import { makeAutoObservable } from 'mobx';
import { Class } from '../../domain/entities/Class';
import { ClassUseCase } from '../../domain/usecases/class/ClassUseCase';

export class ClassViewModel {
    classes: Class[] = [];
    selectedClass: Class | null = null;
    isLoading = false;
    error: string | null = null;

    constructor(private classUseCase: ClassUseCase) {
        makeAutoObservable(this);
    }

    async loadClasses() {
        this.isLoading = true;
        this.error = null;
        try {
            this.classes = await this.classUseCase.getClasses();
        } catch (error) {
            this.error = 'Failed to load classes';
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }

    async loadClass(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
            this.selectedClass = await this.classUseCase.getClass(id);
        } catch (error) {
            this.error = 'Failed to load class';
            console.error(error);
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
        } catch (error) {
            this.error = 'Failed to create class';
            console.error(error);
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
            if (this.selectedClass?.id === id) {
                this.selectedClass = updatedClass;
            }
        } catch (error) {
            this.error = 'Failed to update class';
            console.error(error);
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
            if (this.selectedClass?.id === id) {
                this.selectedClass = null;
            }
        } catch (error) {
            this.error = 'Failed to delete class';
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }

    async searchClasses(query: string) {
        this.isLoading = true;
        this.error = null;
        try {
            this.classes = await this.classUseCase.searchClasses(query);
        } catch (error) {
            this.error = 'Failed to search classes';
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }

    clearError() {
        this.error = null;
    }
} 