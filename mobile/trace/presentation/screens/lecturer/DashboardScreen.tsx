import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { Lecturer } from '../../../domain/entities/User';
import { router } from 'expo-router';

export const DashboardScreen = observer(() => {
    const { authStore } = useStores();
    const user = authStore.authState.user as Lecturer;
    const [refreshing, setRefreshing] = React.useState(false);

    // Mock data - replace with actual data from your backend
    const todayClasses = [
        { id: '1', course: 'Computer Science 101', time: '09:00 - 10:30', room: 'Room 101', status: 'upcoming' },
        { id: '2', course: 'Data Structures', time: '11:00 - 12:30', room: 'Room 202', status: 'active' },
        { id: '3', course: 'Algorithms', time: '14:00 - 15:30', room: 'Room 303', status: 'completed' },
    ];

    const activeSessions = [
        { id: '1', course: 'Data Structures', startTime: '11:00', attendance: '45/50' },
    ];

    const recentActivities = [
        { id: '1', type: 'session_started', course: 'Data Structures', time: '11:00 AM' },
        { id: '2', type: 'session_ended', course: 'Computer Science 101', time: '10:30 AM' },
        { id: '3', type: 'attendance_exported', course: 'Algorithms', time: 'Yesterday' },
    ];

    const classStatistics = {
        totalClasses: 12,
        activeSessions: 1,
        totalStudents: 150,
        averageAttendance: '85%',
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // TODO: Implement refresh logic
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const handleStartSession = (classId: string) => {
        router.push({
            pathname: '/session-control',
            params: { classId }
        });
    };

    const handleViewClassDetails = (classId: string) => {
        router.push({
            pathname: '/class-details',
            params: { classId }
        });
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Welcome Section */}
            <Card style={styles.section}>
                <Text style={styles.welcomeText}>Welcome, {user.firstName}!</Text>
                <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
            </Card>

            {/* Today's Classes */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Today&apos;s Classes</Text>
                {todayClasses.map((classItem) => (
                    <TouchableOpacity
                        key={classItem.id}
                        style={styles.classItem}
                        onPress={() => handleViewClassDetails(classItem.id)}
                    >
                        <View style={styles.classInfo}>
                            <Text style={styles.className}>{classItem.course}</Text>
                            <Text style={styles.classDetails}>
                                {classItem.time} • {classItem.room}
                            </Text>
                        </View>
                        <View style={[styles.statusBadge, styles[`${classItem.status}Badge` as keyof typeof styles] as ViewStyle]}>
                            <Text style={styles.statusText}>
                                {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </Card>

            {/* Active Sessions */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Active Sessions</Text>
                {activeSessions.map((session) => (
                    <TouchableOpacity
                        key={session.id}
                        style={styles.sessionItem}
                        onPress={() => handleStartSession(session.id)}
                    >
                        <View style={styles.sessionInfo}>
                            <Text style={styles.sessionName}>{session.course}</Text>
                            <Text style={styles.sessionDetails}>
                                Started at {session.startTime} • {session.attendance} students
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => handleStartSession(session.id)}
                        >
                            <Text style={styles.controlButtonText}>Control Session</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </Card>

            {/* Quick Actions */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/class-management')}
                    >
                        <Text style={styles.actionButtonText}>Manage Classes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/reports-dashboard')}
                    >
                        <Text style={styles.actionButtonText}>View Reports</Text>
                    </TouchableOpacity>
                </View>
            </Card>

            {/* Class Statistics */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Class Statistics</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{classStatistics.totalClasses}</Text>
                        <Text style={styles.statLabel}>Total Classes</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{classStatistics.activeSessions}</Text>
                        <Text style={styles.statLabel}>Active Sessions</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{classStatistics.totalStudents}</Text>
                        <Text style={styles.statLabel}>Total Students</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{classStatistics.averageAttendance}</Text>
                        <Text style={styles.statLabel}>Avg. Attendance</Text>
                    </View>
                </View>
            </Card>

            {/* Recent Activities */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                {recentActivities.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityType}>
                                {activity.type.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                            </Text>
                            <Text style={styles.activityDetails}>
                                {activity.course} • {activity.time}
                            </Text>
                        </View>
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
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    classItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    classInfo: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    classDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    upcomingBadge: {
        backgroundColor: colors.warning,
    },
    activeBadge: {
        backgroundColor: colors.success,
    },
    completedBadge: {
        backgroundColor: colors.textSecondary,
    },
    statusText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    sessionItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sessionInfo: {
        marginBottom: 8,
    },
    sessionName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    sessionDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    controlButton: {
        backgroundColor: colors.primary,
        padding: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    controlButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 8,
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
    activityItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    activityInfo: {
        flex: 1,
    },
    activityType: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    activityDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
}); 