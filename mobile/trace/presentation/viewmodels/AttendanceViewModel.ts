import { makeAutoObservable } from 'mobx';
import { AttendanceUseCase } from '../../domain/usecases/attendance/AttendanceUseCase';
import { AttendanceSession, AttendanceRecord } from '../../domain/entities/Attendance';
import { AttendanceError } from '../../domain/errors/AppError';
import { handleError } from '../../utils/errorHandler';

export class AttendanceViewModel {
    public readonly attendanceUseCase: AttendanceUseCase;
    public sessions: AttendanceSession[] = [];
    public currentSession: AttendanceSession | null = null;
    public records: AttendanceRecord[] = [];
    public isLoading: boolean = false;
    public error: AttendanceError | null = null;

    constructor(attendanceUseCase: AttendanceUseCase) {
        this.attendanceUseCase = attendanceUseCase;
        makeAutoObservable(this);
    }

    async loadSessions(classId: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const sessions = await this.attendanceUseCase.getSessions(classId);
            this.sessions = sessions;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to load sessions:', error);
        } finally {
            this.isLoading = false;
        }
    }

    async getSession(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const session = await this.attendanceUseCase.getSession(id);
            this.currentSession = session;
            return session;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to get session:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>) {
        this.isLoading = true;
        this.error = null;
        try {
            const newSession = await this.attendanceUseCase.createSession(data);
            this.sessions.push(newSession);
            return newSession;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to create session:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async updateSession(id: string, data: Partial<AttendanceSession>) {
        this.isLoading = true;
        this.error = null;
        try {
            const updatedSession = await this.attendanceUseCase.updateSession(id, data);
            const index = this.sessions.findIndex(s => s.id === id);
            if (index !== -1) {
                this.sessions[index] = updatedSession;
            }
            if (this.currentSession?.id === id) {
                this.currentSession = updatedSession;
            }
            return updatedSession;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to update session:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async deleteSession(id: string) {
        this.isLoading = true;
        this.error = null;
        try {
            await this.attendanceUseCase.deleteSession(id);
            this.sessions = this.sessions.filter(s => s.id !== id);
            if (this.currentSession?.id === id) {
                this.currentSession = null;
            }
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to delete session:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']) {
        this.isLoading = true;
        this.error = null;
        try {
            const record = await this.attendanceUseCase.markAttendance(sessionId, studentId, method);
            if (this.currentSession?.id === sessionId) {
                const index = this.records.findIndex(r => r.id === record.id);
                if (index !== -1) {
                    this.records[index] = record;
                } else {
                    this.records.push(record);
                }
            }
            return record;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to mark attendance:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async getStudentAttendance(studentId: string, classId: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const records = await this.attendanceUseCase.getStudentAttendance(studentId, classId);
            this.records = records;
            return records;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to get student attendance:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async getClassAttendance(classId: string, date: Date) {
        this.isLoading = true;
        this.error = null;
        try {
            const session = await this.attendanceUseCase.getClassAttendance(classId, date);
            if (session) {
                this.currentSession = session;
                this.records = session.records;
            }
            return session;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to get class attendance:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async searchSessions(query: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const results = await this.attendanceUseCase.searchSessions(query);
            this.sessions = results;
            return results;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to search sessions:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async startAttendanceSession(classId: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const session = await this.attendanceUseCase.startAttendanceSession(classId);
            this.sessions.push(session);
            this.currentSession = session;
            return session;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to start attendance session:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async endAttendanceSession(sessionId: string) {
        this.isLoading = true;
        this.error = null;
        try {
            const session = await this.attendanceUseCase.endAttendanceSession(sessionId);
            const index = this.sessions.findIndex(s => s.id === sessionId);
            if (index !== -1) {
                this.sessions[index] = session;
            }
            if (this.currentSession?.id === sessionId) {
                this.currentSession = session;
            }
            return session;
        } catch (error) {
            this.error = handleError(error) as AttendanceError;
            console.error('Failed to end attendance session:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
} 