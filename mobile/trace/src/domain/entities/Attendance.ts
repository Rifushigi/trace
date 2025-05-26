import { Class } from './Class';
import { Student } from './User';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
    id: string;
    student: Student;
    status: AttendanceStatus;
    timestamp: Date;
    method: 'face' | 'nfc' | 'ble' | 'manual';
    confidence?: number;
    location?: {
        latitude: number;
        longitude: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface AttendanceSession {
    id: string;
    class: Class;
    date: Date;
    startTime: Date;
    endTime: Date;
    status: 'active' | 'completed' | 'cancelled';
    records: AttendanceRecord[];
    createdAt: Date;
    updatedAt: Date;
} 