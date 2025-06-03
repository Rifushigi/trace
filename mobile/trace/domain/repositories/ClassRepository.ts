import { Class } from '@/domain/entities/Class';
import { AppError } from '@/shared/errors/AppError';

export interface ClassRepository {
    getClass(id: string): Promise<Class | AppError>;
    getClasses(): Promise<Class[] | AppError>;
    createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class | AppError>;
    updateClass(id: string, data: Partial<Class>): Promise<Class | AppError>;
    deleteClass(id: string): Promise<void | AppError>;
    addStudent(classId: string, studentId: string): Promise<void | AppError>;
    removeStudent(classId: string, studentId: string): Promise<void | AppError>;
    getLecturerClasses(lecturerId: string): Promise<Class[] | AppError>;
    getStudentClasses(studentId: string): Promise<Class[] | AppError>;
    searchClasses(query: string): Promise<Class[] | AppError>;
} 