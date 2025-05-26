import { Class } from '../../entities/Class';

export interface ClassUseCase {
    getClass(id: string): Promise<Class | null>;
    getClasses(): Promise<Class[]>;
    createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class>;
    updateClass(id: string, data: Partial<Class>): Promise<Class>;
    deleteClass(id: string): Promise<void>;
    addStudent(classId: string, studentId: string): Promise<void>;
    removeStudent(classId: string, studentId: string): Promise<void>;
    getLecturerClasses(lecturerId: string): Promise<Class[]>;
    getStudentClasses(studentId: string): Promise<Class[]>;
    searchClasses(query: string): Promise<Class[]>;
} 