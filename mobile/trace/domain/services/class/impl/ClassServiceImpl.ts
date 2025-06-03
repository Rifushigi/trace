import { Class } from '@/domain/entities/Class';
import { ClassRepository } from '@/domain/repositories/ClassRepository';
import { ClassService } from '@/domain/services/class/ClassService';
import { AppError } from '@/shared/errors/AppError';

// orchestration entities and validation logic
export class ClassServiceImpl implements ClassService {
    constructor(private classRepository: ClassRepository) { }

    async getClass(id: string) {
        const result = await this.classRepository.getClass(id);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async getClasses() {
        const result = await this.classRepository.getClasses();
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) {
        const result = await this.classRepository.createClass(data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updateClass(id: string, data: Partial<Class>) {
        const result = await this.classRepository.updateClass(id, data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async deleteClass(id: string) {
        const result = await this.classRepository.deleteClass(id);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async addStudent(classId: string, studentId: string) {
        const result = await this.classRepository.addStudent(classId, studentId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async removeStudent(classId: string, studentId: string) {
        const result = await this.classRepository.removeStudent(classId, studentId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async getLecturerClasses(lecturerId: string) {
        const result = await this.classRepository.getLecturerClasses(lecturerId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async getStudentClasses(studentId: string) {
        const result = await this.classRepository.getStudentClasses(studentId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async searchClasses(query: string) {
        const result = await this.classRepository.searchClasses(query);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }
} 