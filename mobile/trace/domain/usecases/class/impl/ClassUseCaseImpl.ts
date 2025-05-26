import { Class } from '../../../entities/Class';
import { ClassRepository } from '../../../repositories/ClassRepository';
import { ClassUseCase } from '../ClassUseCase';

export class ClassUseCaseImpl implements ClassUseCase {
    constructor(private classRepository: ClassRepository) { }

    async getClass(id: string) {
        return this.classRepository.getClass(id);
    }

    async getClasses() {
        return this.classRepository.getClasses();
    }

    async createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) {
        return this.classRepository.createClass(data);
    }

    async updateClass(id: string, data: Partial<Class>) {
        return this.classRepository.updateClass(id, data);
    }

    async deleteClass(id: string) {
        return this.classRepository.deleteClass(id);
    }

    async addStudent(classId: string, studentId: string) {
        return this.classRepository.addStudent(classId, studentId);
    }

    async removeStudent(classId: string, studentId: string) {
        return this.classRepository.removeStudent(classId, studentId);
    }

    async getLecturerClasses(lecturerId: string) {
        return this.classRepository.getLecturerClasses(lecturerId);
    }

    async getStudentClasses(studentId: string) {
        return this.classRepository.getStudentClasses(studentId);
    }

    async searchClasses(query: string) {
        return this.classRepository.searchClasses(query);
    }
} 