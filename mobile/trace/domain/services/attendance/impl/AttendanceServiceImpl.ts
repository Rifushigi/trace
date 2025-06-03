import { AttendanceService } from '@/domain/services/attendance/AttendanceService';
import { AttendanceRepository } from '@/domain/repositories/AttendanceRepository';
import { AttendanceSession, AttendanceRecord } from '@/domain/entities/Attendance';
import { AppError } from '@/shared/errors/AppError';


// orchestration entities and validation logic
export class AttendanceServiceImpl implements AttendanceService {
    constructor(private readonly attendanceRepository: AttendanceRepository) { }

    async getSession(id: string): Promise<AttendanceSession | null> {
        const result = await this.attendanceRepository.getSession(id);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async getSessions(classId: string): Promise<AttendanceSession[]> {
        const result = await this.attendanceRepository.getSessions(classId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>): Promise<AttendanceSession> {
        const result = await this.attendanceRepository.createSession(data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updateSession(id: string, data: Partial<AttendanceSession>): Promise<AttendanceSession> {
        const result = await this.attendanceRepository.updateSession(id, data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async deleteSession(id: string): Promise<void> {
        const result = await this.attendanceRepository.deleteSession(id);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async addRecord(sessionId: string, record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendanceRecord> {
        const result = await this.attendanceRepository.addRecord(sessionId, record);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async updateRecord(sessionId: string, recordId: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
        const result = await this.attendanceRepository.updateRecord(sessionId, recordId, data);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async deleteRecord(sessionId: string, recordId: string): Promise<void> {
        const result = await this.attendanceRepository.deleteRecord(sessionId, recordId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async getStudentAttendance(studentId: string, classId: string): Promise<AttendanceRecord[]> {
        const result = await this.attendanceRepository.getStudentAttendance(studentId, classId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async getClassAttendance(classId: string, date: Date): Promise<AttendanceSession | null> {
        const result = await this.attendanceRepository.getClassAttendance(classId, date);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async searchSessions(query: string): Promise<AttendanceSession[]> {
        const result = await this.attendanceRepository.searchSessions(query);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async startAttendanceSession(classId: string): Promise<AttendanceSession> {
        const result = await this.attendanceRepository.startAttendanceSession(classId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async endAttendanceSession(sessionId: string): Promise<AttendanceSession> {
        const result = await this.attendanceRepository.endAttendanceSession(sessionId);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }

    async markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']): Promise<AttendanceRecord> {
        const result = await this.attendanceRepository.markAttendance(sessionId, studentId, method);
        if (result instanceof AppError) {
            throw result;
        }
        return result;
    }
} 