import { Lecturer, Student } from "./User";

export interface ScheduleInfo {
    day: string;
    startTime: string;
    endTime: string;
    room: string;
}

export interface CourseMaterial {
    id: string;
    title: string;
    type: string;
    date: string;
    url?: string;
}

export interface AttendanceStats {
    total: number;
    present: number;
    absent: number;
    late: number;
}

export interface Schedule {
    id: string;
    course: string;
    code: string;
    lecturer: Lecturer;
    schedule: ScheduleInfo;
    students: Student[];
    status: 'upcoming' | 'active' | 'completed';
    attendance: AttendanceStats;
    materials: {
        id: string;
        title: string;
        type: 'syllabus' | 'notes' | 'assignment' | 'other';
        url: string;
        uploadDate: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
} 