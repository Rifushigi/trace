import { Lecturer, Student } from '@/domain/entities/User';

export interface Class {
    id: string;
    name: string;
    code: string;
    lecturer: Lecturer;
    students: Student[];
    schedule: {
        day: string;
        startTime: string;
        endTime: string;
        room: string;
    };
    createdAt: Date;
    updatedAt: Date;
} 