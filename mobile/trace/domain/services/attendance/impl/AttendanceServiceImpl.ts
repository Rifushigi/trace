import { AttendanceUseCase } from '@/domain/services/attendance/AttendanceService';
import { AttendanceRepository } from '@/domain/repositories/AttendanceRepository';
import { AttendanceSession, AttendanceRecord } from '@/domain/entities/Attendance';


// orchestration entities and validation logic
export class AttendanceUseCaseImpl implements AttendanceUseCase {
    constructor(private readonly attendanceRepository: AttendanceRepository) { }

    async getSession(id: string): Promise<AttendanceSession | null> {
        return this.attendanceRepository.getSession(id);
    }

    async getSessions(classId: string): Promise<AttendanceSession[]> {
        return this.attendanceRepository.getSessions(classId);
    }

    async createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>): Promise<AttendanceSession> {
        return this.attendanceRepository.createSession(data);
    }

    async updateSession(id: string, data: Partial<AttendanceSession>): Promise<AttendanceSession> {
        return this.attendanceRepository.updateSession(id, data);
    }

    async deleteSession(id: string): Promise<void> {
        return this.attendanceRepository.deleteSession(id);
    }

    async addRecord(sessionId: string, record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendanceRecord> {
        return this.attendanceRepository.addRecord(sessionId, record);
    }

    async updateRecord(sessionId: string, recordId: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
        return this.attendanceRepository.updateRecord(sessionId, recordId, data);
    }

    async deleteRecord(sessionId: string, recordId: string): Promise<void> {
        return this.attendanceRepository.deleteRecord(sessionId, recordId);
    }

    async getStudentAttendance(studentId: string, classId: string): Promise<AttendanceRecord[]> {
        return this.attendanceRepository.getStudentAttendance(studentId, classId);
    }

    async getClassAttendance(classId: string, date: Date): Promise<AttendanceSession | null> {
        return this.attendanceRepository.getClassAttendance(classId, date);
    }

    async searchSessions(query: string): Promise<AttendanceSession[]> {
        return this.attendanceRepository.searchSessions(query);
    }

    async startAttendanceSession(classId: string): Promise<AttendanceSession> {
        return this.attendanceRepository.startAttendanceSession(classId);
    }

    async endAttendanceSession(sessionId: string): Promise<AttendanceSession> {
        return this.attendanceRepository.endAttendanceSession(sessionId);
    }

    async markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']): Promise<AttendanceRecord> {
        return this.attendanceRepository.markAttendance(sessionId, studentId, method);
    }
} 