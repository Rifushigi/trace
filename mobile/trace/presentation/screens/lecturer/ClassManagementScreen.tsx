import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { router } from 'expo-router';
import { features } from '../../../config/features';
import { getMockClasses } from '../../../presentation/mocks/classManagementMock';
import { Class } from '../../../domain/entities/Class';

export const ClassManagementScreen = observer(() => {
    const [refreshing, setRefreshing] = useState(false);
    const [classes, setClasses] = useState<Class[]>([]);

    const fetchClasses = async () => {
        if (features.useMockApi) {
            const mockData = getMockClasses();
            setClasses(mockData);
            return;
        }
        // TODO: Implement actual API call
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchClasses().finally(() => {
            setRefreshing(false);
        });
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return colors.success;
            case 'upcoming':
                return colors.warning;
            case 'completed':
                return colors.text;
            default:
                return colors.text;
        }
    };

    const getClassStatus = (cls: Class) => {
        const now = new Date();
        const [startHour, startMinute] = cls.schedule.startTime.split(':').map(Number);
        const [endHour, endMinute] = cls.schedule.endTime.split(':').map(Number);

        const classStart = new Date();
        classStart.setHours(startHour, startMinute, 0, 0);
        const classEnd = new Date();
        classEnd.setHours(endHour, endMinute, 0, 0);

        if (now > classEnd) return 'completed';
        if (now >= classStart && now <= classEnd) return 'active';
        return 'upcoming';
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {classes.map((cls) => {
                const status = getClassStatus(cls);
                return (
                    <Card key={cls.id} style={styles.classCard}>
                        <View style={styles.classHeader}>
                            <View>
                                <Text style={styles.courseName}>{cls.name}</Text>
                                <Text style={styles.courseCode}>{cls.code}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                                <Text style={styles.statusText}>{status}</Text>
                            </View>
                        </View>

                        <View style={styles.classDetails}>
                            <Text style={styles.detailText}>Schedule: {cls.schedule.day}, {cls.schedule.startTime} - {cls.schedule.endTime}</Text>
                            <Text style={styles.detailText}>Room: {cls.schedule.room}</Text>
                            <Text style={styles.detailText}>Students: {cls.students.length}</Text>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.startButton]}
                                onPress={() => handleStartSession(cls.id)}
                            >
                                <Text style={styles.actionButtonText}>Start Session</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.viewButton]}
                                onPress={() => handleViewAttendance(cls.id)}
                            >
                                <Text style={styles.actionButtonText}>View Attendance</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                );
            })}
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 16,
        backgroundColor: colors.primary,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
    },
    classCard: {
        margin: 16,
        padding: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
        elevation: 2,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    courseCode: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    classDetails: {
        marginBottom: 16,
    },
    detailText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: colors.primary,
    },
    viewButton: {
        backgroundColor: colors.secondary,
    },
    actionButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
}); 