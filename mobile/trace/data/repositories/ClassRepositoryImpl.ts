import { Class } from '@/domain/entities/Class';
import { ClassRepository } from '@/domain/repositories/ClassRepository';
import { ClassApi } from '@/data/datasources/remote/ClassApi';
import { AppError, RepositoryError } from '@/shared/errors/AppError';

export class ClassRepositoryImpl implements ClassRepository {
    constructor(private classApi: ClassApi) { }

    async getClass(id: string): Promise<Class | AppError> {
        try {
            return await this.classApi.getClass(id);
        } catch (error) {
            throw new RepositoryError(
                'Error getting class',
                'ClassRepository',
                'getClass',
                error
            );
        }
    }

    async getClasses(): Promise<Class[] | AppError> {
        try {
            return await this.classApi.getClasses();
        } catch (error) {
            throw new RepositoryError(
                'Error getting classes',
                'ClassRepository',
                'getClasses',
                error
            );
        }
    }

    async createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class | AppError> {
        try {
            return await this.classApi.createClass(data);
        } catch (error) {
            throw new RepositoryError(
                'Error creating class',
                'ClassRepository',
                'createClass',
                error
            );
        }
    }

    async updateClass(id: string, data: Partial<Class>): Promise<Class | AppError> {
        try {
            return await this.classApi.updateClass(id, data);
        } catch (error) {
            throw new RepositoryError(
                'Error updating class',
                'ClassRepository',
                'updateClass',
                error
            );
        }
    }

    async deleteClass(id: string): Promise<void | AppError> {
        try {
            await this.classApi.deleteClass(id);
        } catch (error) {
            throw new RepositoryError(
                'Error deleting class',
                'ClassRepository',
                'deleteClass',
                error
            );
        }
    }

    async addStudent(classId: string, studentId: string): Promise<void | AppError> {
        try {
            await this.classApi.addStudent(classId, studentId);
        } catch (error) {
            throw new RepositoryError(
                'Error adding student to class',
                'ClassRepository',
                'addStudent',
                error
            );
        }
    }

    async removeStudent(classId: string, studentId: string): Promise<void | AppError> {
        try {
            await this.classApi.removeStudent(classId, studentId);
        } catch (error) {
            throw new RepositoryError(
                'Error removing student from class',
                'ClassRepository',
                'removeStudent',
                error
            );
        }
    }

    async getLecturerClasses(lecturerId: string): Promise<Class[] | AppError> {
        try {
            return await this.classApi.getLecturerClasses(lecturerId);
        } catch (error) {
            throw new RepositoryError(
                'Error getting lecturer classes',
                'ClassRepository',
                'getLecturerClasses',
                error
            );
        }
    }

    async getStudentClasses(studentId: string): Promise<Class[] | AppError> {
        try {
            return await this.classApi.getStudentClasses(studentId);
        } catch (error) {
            throw new RepositoryError(
                'Error getting student classes',
                'ClassRepository',
                'getStudentClasses',
                error
            );
        }
    }

    async searchClasses(query: string): Promise<Class[] | AppError> {
        try {
            return await this.classApi.searchClasses(query);
        } catch (error) {
            throw new RepositoryError(
                'Error searching classes',
                'ClassRepository',
                'searchClasses',
                error
            );
        }
    }
} 