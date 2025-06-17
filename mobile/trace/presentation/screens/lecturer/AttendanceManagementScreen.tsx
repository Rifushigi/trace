import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { features } from '../../../config/features';
import { getMockAttendanceSessions, getMockClass } from '../../../presentation/mocks/attendanceManagementMock';
import { AttendanceSession } from '../../../domain/entities/Attendance';
import { format } from 'date-fns';

export const AttendanceManagementScreen = observer(() => {
    const { classId } = useLocalSearchParams<{ classId: string }>();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<AttendanceSession[]>([]);
    const [classDetails, setClassDetails] = useState<any>(null);

    const fetchData = useCallback(async () => {
        if (features.useMockApi) {
            const mockSessions = getMockAttendanceSessions(classId);
            const mockClass = getMockClass(classId);
            setSessions(mockSessions);
            setClassDetails(mockClass);
            return;
        }
    }, [classId]);

    useEffect(() => {
        fetchData().finally(() => {
            setLoading(false);
        });
    }, [classId, fetchData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().finally(() => {
            setRefreshing(false);
        });
    }, [fetchData]);

    const handleStartSession = () => {
        router.push({
            pathname: '/session-control',
            params: { classId }
        });
    };

    const handleViewSession = (sessionId: string) => {
        router.push({
            pathname: '/(lecturer)/session-details',
            params: { sessionId }
        });
    };

    const calculateAttendanceStats = (session: AttendanceSession) => {
        const total = session.records.length;
        const present = session.records.filter(r => r.status === 'present').length;
        const late = session.records.filter(r => r.status === 'late').length;
        const absent = session.records.filter(r => r.status === 'absent').length;
        const attendanceRate = (present / total) * 100;

        return {
            total,
            present,
            late,
            absent,
            attendanceRate
        };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                {classDetails && (
                    <View style={styles.classInfo}>
                        <Text style={styles.className}>{classDetails.name}</Text>
                        <Text style={styles.classCode}>{classDetails.code}</Text>
                    </View>
                )}
            </View>

            <Card style={styles.statsCard}>
                <Text style={styles.statsTitle}>Overall Statistics</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{sessions.length}</Text>
                        <Text style={styles.statLabel}>Total Sessions</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {sessions.length === 0
                                ? '0%'
                                : `${Math.round(
                                    sessions.reduce(
                                        (acc, session) => acc + calculateAttendanceStats(session).attendanceRate,
                                        0
                                    ) / sessions.length
                                )}%`
                            }
                        </Text>
                        <Text style={styles.statLabel}>Average Attendance</Text>
                    </View>
                </View>
            </Card>

            <View style={styles.sessionsHeader}>
                <Text style={styles.sessionsTitle}>Attendance Sessions</Text>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStartSession}
                >
                    <Text style={styles.startButtonText}>Start New Session</Text>
                </TouchableOpacity>
            </View>

            {sessions.map((session) => {
                const stats = calculateAttendanceStats(session);
                return (
                    <Card key={session.id} style={styles.sessionCard}>
                        <View style={styles.sessionHeader}>
                            <View>
                                <Text style={styles.sessionDate}>
                                    {format(session.date, 'MMMM d, yyyy')}
                                </Text>
                                <Text style={styles.sessionTime}>
                                    {format(session.startTime, 'h:mm a')} - {format(session.endTime, 'h:mm a')}
                                </Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                                <Text style={styles.statusText}>{session.status}</Text>
                            </View>
                        </View>

                        <View style={styles.attendanceStats}>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats.present}</Text>
                                    <Text style={styles.statLabel}>Present</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats.late}</Text>
                                    <Text style={styles.statLabel}>Late</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats.absent}</Text>
                                    <Text style={styles.statLabel}>Absent</Text>
                                </View>
                            </View>
                            <View style={styles.attendanceRate}>
                                <Text style={styles.rateValue}>{Math.round(stats.attendanceRate)}%</Text>
                                <Text style={styles.rateLabel}>Attendance Rate</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() => handleViewSession(session.id)}
                        >
                            <Text style={styles.viewButtonText}>View Details</Text>
                        </TouchableOpacity>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    header: {
        padding: 16,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    classInfo: {
        marginTop: 8,
    },
    className: {
        fontSize: 18,
        color: colors.text,
        fontWeight: '600',
    },
    classCode: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        opacity: 0.8,
        marginTop: 4,
    },
    statsCard: {
        margin: 16,
        padding: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
        elevation: 2,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    sessionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sessionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    startButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    startButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    sessionCard: {
        margin: 16,
        marginTop: 0,
        padding: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
        elevation: 2,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    sessionDate: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    sessionTime: {
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
    attendanceStats: {
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    attendanceRate: {
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    rateValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    rateLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    viewButton: {
        backgroundColor: colors.secondary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    viewButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
});