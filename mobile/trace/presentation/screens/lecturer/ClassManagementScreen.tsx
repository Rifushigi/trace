import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { Lecturer } from '../../../domain/entities/User';
import { router } from 'expo-router';

export const ClassManagementScreen = observer(() => {
    const { authStore } = useStores();
    const user = authStore.state.user as Lecturer;
    const [refreshing, setRefreshing] = useState(false);

    // Mock data - replace with actual data from your backend
    const classes = [
        {
            id: '1',
            course: 'Computer Science 101',
            schedule: 'Mon, Wed 09:00 - 10:30',
            room: 'Room 101',
            students: 50,
            status: 'active',
        },
        {
            id: '2',
            course: 'Data Structures',
            schedule: 'Tue, Thu 11:00 - 12:30',
            room: 'Room 202',
            students: 45,
            status: 'upcoming',
        },
        {
            id: '3',
            course: 'Algorithms',
            schedule: 'Fri 14:00 - 15:30',
            room: 'Room 303',
            students: 40,
            status: 'completed',
        },
    ];

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

    const handleViewAttendance = (classId: string) => {
        router.push({
            pathname: '/attendance-management',
            params: { classId }
        });
    };

    const handleViewDetails = (classId: string) => {
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
            {/* Class List */}
            {classes.map((classItem) => (
                <Card key={classItem.id} style={styles.classCard}>
                    <View style={styles.classHeader}>
                        <View style={styles.classInfo}>
                            <Text style={styles.className}>{classItem.course}</Text>
                            <Text style={styles.classDetails}>
                                {classItem.schedule} • {classItem.room}
                            </Text>
                            <Text style={styles.studentCount}>
                                {classItem.students} students
                            </Text>
                        </View>
                        <View style={[styles.statusBadge, styles[`${classItem.status}Badge` as keyof typeof styles] as ViewStyle]}>
                            <Text style={styles.statusText}>
                                {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        {classItem.status === 'upcoming' && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.primaryButton]}
                                onPress={() => handleStartSession(classItem.id)}
                            >
                                <Text style={styles.actionButtonText}>Start Session</Text>
                            </TouchableOpacity>
                        )}
                        {classItem.status === 'active' && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.primaryButton]}
                                onPress={() => handleStartSession(classItem.id)}
                            >
                                <Text style={styles.actionButtonText}>Control Session</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryButton]}
                            onPress={() => handleViewAttendance(classItem.id)}
                        >
                            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                                View Attendance
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryButton]}
                            onPress={() => handleViewDetails(classItem.id)}
                        >
                            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                                View Details
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            ))}
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    classCard: {
        margin: 16,
        padding: 16,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    classInfo: {
        flex: 1,
    },
    className: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    classDetails: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    studentCount: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 8,
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
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
        marginBottom: 8,
        minWidth: '45%',
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: '#FFFFFF',
    },
    secondaryButtonText: {
        color: colors.text,
    },
}); 