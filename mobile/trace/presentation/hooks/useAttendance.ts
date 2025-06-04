import { useStores } from '@/stores';
import { AttendanceSession, AttendanceRecord } from '@/domain/entities/Attendance';
import { useApi } from './useApi';
import { AppError } from '@/shared/errors/AppError';

export const useAttendance = () => {
    const { attendanceStore } = useStores();

    const { execute: getSession, isLoading: isLoadingSession, error: sessionError } = useApi<AttendanceSession | null, typeof attendanceStore>({
        store: attendanceStore,
        action: (store) => async (id: string) => {
            const result = await store.getSession(id);
            if (result instanceof AppError) {
                throw result;
            }
            return result;
        },
    });

    const { execute: getSessions, isLoading: isLoadingSessions, error: sessionsError } = useApi<AttendanceSession[], typeof attendanceStore>({
        store: attendanceStore,
        action: (store) => async (classId: string) => {
            const result = await store.getSessions(classId);
            if (result instanceof AppError) {
                throw result;
            }
            return store.sessions;
        },
    });

    const { execute: createSession, isLoading: isCreatingSession, error: createSessionError } = useApi<AttendanceSession, typeof attendanceStore>({
        store: attendanceStore,
        action: (store) => async (data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>) => {
            const result = await store.createSession(data);
            if (result instanceof AppError) {
                throw result;
            }
            return result;
        },
    });

    const { execute: updateSession, isLoading: isUpdatingSession, error: updateSessionError } = useApi<AttendanceSession, typeof attendanceStore>({
        store: attendanceStore,
        action: (store) => async (id: string, data: Partial<AttendanceSession>) => {
            const result = await store.updateSession(id, data);
            if (result instanceof AppError) {
                throw result;
            }
            return result;
        },
    });

    const { execute: deleteSession, isLoading: isDeletingSession, error: deleteSessionError } = useApi<void, typeof attendanceStore>({
        store: attendanceStore,
        action: (store) => async (id: string) => {
            const result = await store.deleteSession(id);
            if (result instanceof AppError) {
                throw result;
            }
        },
    });

    const { execute: getStudentAttendance, isLoading: isLoadingStudentAttendance, error: studentAttendanceError } = useApi<AttendanceRecord[], typeof attendanceStore>({
        store: attendanceStore,
        action: (store) => async (studentId: string, classId: string) => {
            const result = await store.getStudentAttendance(studentId, classId);
            if (result instanceof AppError) {
                throw result;
            }
            return result;
        },
    });

    const { execute: getClassAttendance, isLoading: isLoadingClassAttendance, error: classAttendanceError } = useApi<AttendanceSession | null, typeof attendanceStore>({
        store: attendanceStore,
        action: (store) => async (classId: string, date: Date) => {
            const result = await store.getClassAttendance(classId, date);
            if (result instanceof AppError) {
                throw result;
            }
            return result;
        },
    });

    return {
        // State
        sessions: attendanceStore.sessions,
        currentSession: attendanceStore.currentSession,

        // Loading States
        isLoadingSession,
        isLoadingSessions,
        isCreatingSession,
        isUpdatingSession,
        isDeletingSession,
        isLoadingStudentAttendance,
        isLoadingClassAttendance,

        // Error States
        sessionError,
        sessionsError,
        createSessionError,
        updateSessionError,
        deleteSessionError,
        studentAttendanceError,
        classAttendanceError,

        // Operations
        getSession,
        getSessions,
        createSession,
        updateSession,
        deleteSession,
        getStudentAttendance,
        getClassAttendance,
    };
}; 