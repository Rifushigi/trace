import { makeAutoObservable } from 'mobx';
import { AttendanceService } from '@/domain/services/attendance/AttendanceService';
import { AttendanceSession, AttendanceRecord } from '@/domain/entities/Attendance';
import { handleError } from '@/shared/errors/errorHandler';

export class AttendanceStore {
    public readonly attendanceService: AttendanceService;
    public sessions: AttendanceSession[] = [];
    public currentSession: AttendanceSession | null = null;
    public isLoading: boolean = false;
    public error: string | null = null;

    constructor(attendanceService: AttendanceService) {
        this.attendanceService = attendanceService;
        makeAutoObservable(this);
    }

    async getSession(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const session = await this.attendanceService.getSession(id);
            if (session) {
                this.currentSession = session;
            }
            return session;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to fetch session';
            return handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    async getSessions(classId: string) {
        this.isLoading = true;
        this.error = null;
        try {
            this.sessions = await this.attendanceService.getSessions(classId);
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to fetch sessions';
            return handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    async createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>) {
        this.isLoading = true;
        this.error = null;
        try {
            const session = await this.attendanceService.createSession(data);
            this.sessions.push(session);
            return session;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to create session';
            return handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    async updateSession(id: string, data: Partial<AttendanceSession>) {
        this.isLoading = true;
        this.error = null;
        try {
            const updatedSession = await this.attendanceService.updateSession(id, data);
            const index = this.sessions.findIndex(s => s.id === id);
            if (index !== -1) {
                this.sessions[index] = updatedSession;
            }
            if (this.currentSession?.id === id) {
                this.currentSession = updatedSession;
            }
            return updatedSession;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to update session';
            return handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    async deleteSession(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
            await this.attendanceService.deleteSession(id);
            this.sessions = this.sessions.filter(s => s.id !== id);
            if (this.currentSession?.id === id) {
                this.currentSession = null;
            }
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to delete session';
            return handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    async markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']) {
        this.isLoading = true;
        this.error = null;
        try {
            const record = await this.attendanceService.markAttendance(sessionId, studentId, method);
            if (this.currentSession?.id === sessionId) {
                this.currentSession.records.push(record);
            }
            return record;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to mark attendance';
            return handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    async getStudentAttendance(studentId: string, classId: string) {
        this.isLoading = true;
        this.error = null;
        try {
            return await this.attendanceService.getStudentAttendance(studentId, classId);
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to fetch student attendance';
            return handleError(error);
        } finally {
            this.isLoading = false;
        }
    }

    async getClassAttendance(classId: string, date: Date) {
        this.isLoading = true;
        this.error = null;
        try {
            const session = await this.attendanceService.getClassAttendance(classId, date);
            if (session) {
                this.currentSession = session;
            }
            return session;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to fetch class attendance';
            return handleError(error);
        } finally {
            this.isLoading = false;
        }
    }
} 