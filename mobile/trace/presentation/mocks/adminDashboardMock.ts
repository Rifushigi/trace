export interface SystemStatus {
    status: string;
    lastUpdate: string;
    activeUsers: number;
    activeSessions: number;
    cpuUsage: string;
    memoryUsage: string;
    storageUsage: string;
    uptime: string;
}

export interface UserStatistics {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    pendingApprovals: number;
    studentCount: number;
    lecturerCount: number;
    adminCount: number;
    verifiedUsers: number;
}

export interface RecentActivity {
    id: string;
    type: 'user_registration' | 'attendance_session' | 'system_update' | 'error_alert';
    description: string;
    timestamp: string;
    icon: string;
    color: string;
}

export const mockSystemStatus: SystemStatus = {
    status: 'Operational',
    lastUpdate: new Date().toLocaleString(),
    activeUsers: 150,
    activeSessions: 12,
    cpuUsage: '45%',
    memoryUsage: '60%',
    storageUsage: '35%',
    uptime: '99.9%',
};

export const mockUserStatistics: UserStatistics = {
    totalUsers: 1000,
    activeUsers: 750,
    newUsers: 25,
    pendingApprovals: 5,
    studentCount: 850,
    lecturerCount: 145,
    adminCount: 5,
    verifiedUsers: 980,
};

export const mockRecentActivities: RecentActivity[] = [
    {
        id: '1',
        type: 'user_registration',
        description: 'New student registration: John Doe',
        timestamp: new Date().toLocaleString(),
        icon: 'person-add',
        color: '#1976D2',
    },
    {
        id: '2',
        type: 'attendance_session',
        description: 'Attendance session started: CS101',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(),
        icon: 'schedule',
        color: '#4CAF50',
    },
    {
        id: '3',
        type: 'system_update',
        description: 'System maintenance completed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
        icon: 'system-update',
        color: '#FFC107',
    },
    {
        id: '4',
        type: 'error_alert',
        description: 'High server load detected',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleString(),
        icon: 'warning',
        color: '#F44336',
    },
];

// Helper function to get mock data
export const getMockAdminDashboardData = () => {
    return {
        systemStatus: mockSystemStatus,
        userStatistics: mockUserStatistics,
        recentActivities: mockRecentActivities,
    };
}; 