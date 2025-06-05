import { colors } from '@/shared/constants/theme';
import { getMockSchedule } from './scheduleMock';

interface ActiveSession {
    id: string;
    course: string;
    startTime: string;
    attendance: string;
    progress: number;
    status: 'active' | 'stopped';
}

interface RecentActivity {
    id: string;
    course: string;
    time: string;
    icon: string;
    color: string;
}

interface ClassStatistics {
    totalClasses: number;
    activeSessions: number;
    totalStudents: number;
    averageAttendance: string;
}

interface LecturerDashboard {
    todayClasses: {
        id: string;
        course: string;
        time: string;
        room: string;
        status: 'upcoming' | 'active' | 'completed';
        students: number;
    }[];
    activeSessions: ActiveSession[];
    recentActivities: RecentActivity[];
    classStatistics: ClassStatistics;
}

let mockActiveSessions: ActiveSession[] = [];

export const getMockLecturerDashboard = (): LecturerDashboard => {
    const schedule = getMockSchedule();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Filter today's classes
    const todayClasses = schedule
        .filter(cls => cls.schedule.day.toLowerCase() === today)
        .map(cls => ({
            id: cls.id,
            course: cls.name,
            time: `${cls.schedule.startTime} - ${cls.schedule.endTime}`,
            room: cls.schedule.room,
            status: 'upcoming' as 'upcoming' | 'active' | 'completed',
            students: Math.floor(Math.random() * 20) + 30 // Random number between 30-50
        }));

    // Generate active sessions for classes that are currently ongoing
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Update active sessions
    mockActiveSessions = todayClasses
        .filter(cls => {
            const [startHour, startMinute] = cls.time.split(' - ')[0].split(':').map(Number);
            const [endHour, endMinute] = cls.time.split(' - ')[1].split(':').map(Number);
            const startTime = startHour * 60 + startMinute;
            const endTime = endHour * 60 + endMinute;
            const currentTimeInMinutes = currentHour * 60 + currentMinute;
            return currentTimeInMinutes >= startTime && currentTimeInMinutes <= endTime;
        })
        .map(cls => {
            const existingSession = mockActiveSessions.find(s => s.id === cls.id);
            if (existingSession) {
                return existingSession;
            }
            return {
                id: cls.id,
                course: cls.course,
                startTime: cls.time.split(' - ')[0],
                attendance: `${Math.floor(Math.random() * 10) + 20}/${cls.students}`,
                progress: Math.floor(Math.random() * 30) + 70,
                status: 'active' as const
            };
        });

    // Update class statuses based on active sessions
    todayClasses.forEach(cls => {
        if (mockActiveSessions.some(session => session.id === cls.id)) {
            cls.status = 'active' as 'active' | 'upcoming' | 'completed';
        }
    });

    // Generate recent activities
    const recentActivities: RecentActivity[] = [
        ...mockActiveSessions.map(session => ({
            id: `start-${session.id}`,
            course: session.course,
            time: 'Just now',
            icon: 'play-circle-filled',
            color: '#10B981'
        })),
        ...mockActiveSessions
            .filter(session => session.status === 'stopped')
            .map(session => ({
                id: `stop-${session.id}`,
                course: session.course,
                time: 'Just now',
                icon: 'stop-circle',
                color: '#DC2626'
            }))
    ].slice(-3); // Keep only the 3 most recent activities

    // Calculate class statistics
    const classStatistics: ClassStatistics = {
        totalClasses: todayClasses.length,
        activeSessions: mockActiveSessions.filter(s => s.status === 'active').length,
        totalStudents: todayClasses.reduce((sum, cls) => sum + cls.students, 0),
        averageAttendance: `${Math.floor(Math.random() * 20) + 80}%`
    };

    return {
        todayClasses,
        activeSessions: mockActiveSessions,
        recentActivities,
        classStatistics
    };
};

export const stopSession = (sessionId: string): boolean => {
    const sessionIndex = mockActiveSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
        mockActiveSessions[sessionIndex] = {
            ...mockActiveSessions[sessionIndex],
            status: 'stopped'
        };
        return true;
    }
    return false;
}; 