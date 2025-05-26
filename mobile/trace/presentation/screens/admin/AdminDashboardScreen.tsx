import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { router } from 'expo-router';


export const AdminDashboardScreen = observer(() => {
    const { authStore } = useStores();

    // Mock data - replace with actual data from your backend
    const systemStatus = {
        status: 'Operational',
        lastUpdate: '2024-02-20 10:00:00',
        activeUsers: 150,
        activeSessions: 12,
    };

    const userStatistics = {
        totalUsers: 1000,
        activeUsers: 750,
        newUsers: 25,
        pendingApprovals: 5,
    };

    const recentActivities = [
        {
            id: '1',
            type: 'user_registration',
            description: 'New student registration: John Doe',
            timestamp: '2024-02-20 09:45:00',
        },
        {
            id: '2',
            type: 'attendance_session',
            description: 'Attendance session started: CS101',
            timestamp: '2024-02-20 09:30:00',
        },
        {
            id: '3',
            type: 'system_update',
            description: 'System maintenance completed',
            timestamp: '2024-02-20 09:00:00',
        },
    ];

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'manage_users':
                router.push('/admin/user-management');
                break;
            case 'view_reports':
                // TODO: Implement reports view
                break;
            case 'system_settings':
                // TODO: Implement system settings
                break;
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* System Status */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>System Status</Text>
                <View style={styles.statusContainer}>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Status</Text>
                        <Text style={[styles.statusValue, { color: colors.success }]}>
                            {systemStatus.status}
                        </Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Last Update</Text>
                        <Text style={styles.statusValue}>{systemStatus.lastUpdate}</Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Active Users</Text>
                        <Text style={styles.statusValue}>{systemStatus.activeUsers}</Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Active Sessions</Text>
                        <Text style={styles.statusValue}>{systemStatus.activeSessions}</Text>
                    </View>
                </View>
            </Card>

            {/* User Statistics */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>User Statistics</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStatistics.totalUsers}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStatistics.activeUsers}</Text>
                        <Text style={styles.statLabel}>Active Users</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStatistics.newUsers}</Text>
                        <Text style={styles.statLabel}>New Users</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userStatistics.pendingApprovals}</Text>
                        <Text style={styles.statLabel}>Pending Approvals</Text>
                    </View>
                </View>
            </Card>

            {/* Quick Actions */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleQuickAction('manage_users')}
                    >
                        <Text style={styles.actionButtonText}>Manage Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleQuickAction('view_reports')}
                    >
                        <Text style={styles.actionButtonText}>View Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleQuickAction('system_settings')}
                    >
                        <Text style={styles.actionButtonText}>System Settings</Text>
                    </TouchableOpacity>
                </View>
            </Card>

            {/* Recent Activities */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                {recentActivities.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                        <Text style={styles.activityDescription}>
                            {activity.description}
                        </Text>
                        <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                    </View>
                ))}
            </Card>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    section: {
        margin: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statusItem: {
        width: '48%',
        marginBottom: 16,
    },
    statusLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        marginBottom: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionButton: {
        width: '48%',
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    activityItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    activityDescription: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 4,
    },
    activityTimestamp: {
        fontSize: 14,
        color: colors.textSecondary,
    },
}); 