import { Class } from '@/domain/entities/Class';
import { ClassRepository } from '@/domain/repositories/ClassRepository';
import { ClassApi } from '@/data/datasources/remote/ClassApi';

export class ClassRepositoryImpl implements ClassRepository {
    constructor(private classApi: ClassApi) { }

    async getClass(id: string): Promise<Class | null> {
        try {
            return await this.classApi.getClass(id);
        } catch (error) {
            console.error('Error getting class:', error);
            return null;
        }
    }

    async getClasses(): Promise<Class[]> {
        try {
            return await this.classApi.getClasses();
        } catch (error) {
            console.error('Error getting classes:', error);
            return [];
        }
    }

    async createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class> {
        try {
            return await this.classApi.createClass(data);
        } catch (error) {
            console.error('Error creating class:', error);
            throw error;
        }
    }

    async updateClass(id: string, data: Partial<Class>): Promise<Class> {
        try {
            return await this.classApi.updateClass(id, data);
        } catch (error) {
            console.error('Error updating class:', error);
            throw error;
        }
    }

    async deleteClass(id: string): Promise<void> {
        try {
            await this.classApi.deleteClass(id);
        } catch (error) {
            console.error('Error deleting class:', error);
            throw error;
        }
    }

    async addStudent(classId: string, studentId: string): Promise<void> {
        try {
            await this.classApi.addStudent(classId, studentId);
        } catch (error) {
            console.error('Error adding student to class:', error);
            throw error;
        }
    }

    async removeStudent(classId: string, studentId: string): Promise<void> {
        try {
            await this.classApi.removeStudent(classId, studentId);
        } catch (error) {
            console.error('Error removing student from class:', error);
            throw error;
        }
    }

    async getLecturerClasses(lecturerId: string): Promise<Class[]> {
        try {
            return await this.classApi.getLecturerClasses(lecturerId);
        } catch (error) {
            console.error('Error getting lecturer classes:', error);
            return [];
        }
    }

    async getStudentClasses(studentId: string): Promise<Class[]> {
        try {
            return await this.classApi.getStudentClasses(studentId);
        } catch (error) {
            console.error('Error getting student classes:', error);
            return [];
        }
    }

    async searchClasses(query: string): Promise<Class[]> {
        try {
            return await this.classApi.searchClasses(query);
        } catch (error) {
            console.error('Error searching classes:', error);
            return [];
        }
    }
} 