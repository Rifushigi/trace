import { AttendanceStats } from "@/domain/entities/Attendance";

export interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: 'admin' | 'lecturer' | 'student';
    isVerified: boolean;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    attendanceStats?: AttendanceStats;
}

export interface Student extends User {
    role: 'student';
    matricNo: string;
    program: string;
    level: string;
    faceModelId?: string;
    nfcUid?: string;
    bleToken?: string;
}

export interface Lecturer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'lecturer';
    avatar?: string;
    staffId: string;
    college: string;
    office: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Admin extends User {
    role: 'admin';
}