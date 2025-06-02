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

export interface Lecturer extends User {
    role: 'lecturer';
    staffId: string;
    college: string;
}

export interface Admin extends User {
    role: 'admin';
}

export interface IUserApi {
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    verifyUser(userId: string): Promise<void>;
}