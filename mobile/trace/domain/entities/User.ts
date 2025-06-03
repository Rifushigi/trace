import { AttendanceStats } from "@/domain/entities/Attendance";
import { AppError } from "@/shared/errors/AppError";


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
    getAllUsers(): Promise<User[] | AppError>;
    deleteUser(userId: string): Promise<void | AppError>;
    verifyUser(userId: string): Promise<void | AppError>;
    getProfile(): Promise<User | AppError>;
    updateProfile(data: Partial<User>): Promise<User | AppError>;
    updateProfilePicture(imageUri: string): Promise<User | AppError>;
    deleteProfilePicture(): Promise<User | AppError>;
    updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError>;
    deleteAccount(): Promise<void | AppError>;
}