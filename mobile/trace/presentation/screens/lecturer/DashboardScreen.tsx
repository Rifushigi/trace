import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, Image, Animated, Pressable, ActivityIndicator, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { Lecturer } from '../../../domain/entities/User';
import { router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { features } from '../../../config/features';
import { getMockLecturerDashboard, stopSession } from '../../../presentation/mocks/lecturerDashboardMock';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useRefresh } from '../../hooks/useRefresh';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

export const DashboardScreen = observer(() => {
    const { authStore } = useStores();
    const user = authStore.state.user as Lecturer;
    const [clickCount, setClickCount] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const { handleError, isHandlingError } = useErrorHandler({
        showErrorAlert: true,
        onNetworkError: (error) => {
            Alert.alert('Network Error', 'Please check your internet connection');
        }
    });

    const { isConnected } = useNetworkStatus();

    const { refreshing, handleRefresh } = useRefresh({
        onRefresh: async () => {
            if (features.useMockApi) {
                // In development, simulate a delay for mock data
                await new Promise(resolve => setTimeout(resolve, 1000));
                return;
            }
            // TODO: Implement real API refresh logic
        }
    });

    useEffect(() => {
        if (isConnected || features.useMockApi) {
            handleRefresh();
        }
    }, []);

    const startPulseAnimation = useCallback(() => {
        if (clickCount >= 10) return;

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [clickCount, pulseAnim]);

    useEffect(() => {
        startPulseAnimation();
    }, [startPulseAnimation]);

    const handleStartSession = (classId: string) => {
        router.push({
            pathname: '/session-control',
            params: { classId }
        });
    };

    const handleStopSession = (sessionId: string) => {
        if (features.useMockApi) {
            const success = stopSession(sessionId);
            if (success) {
                handleRefresh();
            }
        } else {
            // TODO: Implement real API call to stop session
            Alert.alert('Not Implemented', 'This feature is not yet implemented in the real API');
        }
    };

    const handleViewClassDetails = (classId: string) => {
        router.push({
            pathname: '/class-details',
            params: { classId }
        });
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        setClickCount(prev => {
            const newCount = prev + 1;
            if (newCount === 10) {
                pulseAnim.stopAnimation();
                pulseAnim.setValue(1);
            }
            return newCount;
        });
        router.push('/(profile)');
    };

    if (!user) {
        return null;
    }

    if (!features.useMockApi && isHandlingError) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!features.useMockApi && !isConnected) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No internet connection available</Text>
            </View>
        );
    }

    // Get mock data
    const { todayClasses, activeSessions, recentActivities, classStatistics } = features.useMockApi
        ? getMockLecturerDashboard()
        : {
            todayClasses: [],
            activeSessions: [],
            recentActivities: [],
            classStatistics: {
                totalClasses: 0,
                activeSessions: 0,
                totalStudents: 0,
                averageAttendance: '0%'
            }
        };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 16,
            }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={colors.primary}
                    colors={[colors.primary]}
                />
            }
        >
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeText}>
                            {getGreeting()},{'\n'}
                            <Text style={styles.nameText}>{user?.firstName}!</Text>
                        </Text>
                        <Text style={styles.dateText}>
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>
                    <View style={styles.profileSection}>
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handlePress}
                        >
                            <Animated.View
                                style={[
                                    styles.profilePicture,
                                    {
                                        transform: [
                                            { scale: scaleAnim }
                                        ]
                                    }
                                ]}
                            >
                                <Animated.View
                                    style={[
                                        styles.profileBorder,
                                        {
                                            transform: [{ scale: pulseAnim }],
                                            opacity: clickCount >= 10 ? 0.3 : 1,
                                        }
                                    ]}
                                />
                                {user?.avatar ? (
                                    <Image
                                        source={{ uri: user.avatar }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <Text style={styles.profileInitial}>
                                        {user?.firstName?.charAt(0)?.toUpperCase()}
                                    </Text>
                                )}
                            </Animated.View>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Today's Classes */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="schedule" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Today&apos;s Classes</Text>
                </View>
                {todayClasses.length > 0 ? (
                    todayClasses.map((cls) => (
                        <TouchableOpacity
                            key={cls.id}
                            style={styles.classItem}
                            onPress={() => handleViewClassDetails(cls.id)}
                        >
                            <View style={styles.classInfo}>
                                <Text style={styles.className}>{cls.course}</Text>
                                <Text style={styles.classCode}>
                                    {cls.code}
                                </Text>
                                <Text style={styles.classDetails}>
                                    {cls.time} • {cls.room}
                                </Text>
                            </View>
                            <View style={styles.classStatus}>
                                <Text style={[
                                    styles.statusText,
                                    { color: cls.status === 'active' ? colors.success : colors.textSecondary }
                                ]}>
                                    {cls.status}
                                </Text>
                                <Text style={styles.studentCount}>
                                    {cls.students} students
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noClassesText}>No classes scheduled for today</Text>
                )}
            </Card>

            {/* Active Sessions */}
            {activeSessions.length > 0 && (
                <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="play-circle-filled" size={24} color={colors.success} />
                        <Text style={styles.sectionTitle}>Active Sessions</Text>
                    </View>
                    {activeSessions.map((session) => (
                        <TouchableOpacity
                            key={session.id}
                            style={styles.sessionItem}
                            onPress={() => handleStartSession(session.id)}
                        >
                            <View style={styles.sessionInfo}>
                                <Text style={styles.sessionName}>{session.course}</Text>
                                <Text style={styles.sessionDetails}>
                                    Started at {session.startTime}
                                </Text>
                            </View>
                            <View style={styles.sessionStats}>
                                <Text style={styles.attendanceText}>
                                    {session.attendance}
                                </Text>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${session.progress}%` }
                                        ]}
                                    />
                                </View>
                                {session.status === 'active' && (
                                    <TouchableOpacity
                                        style={styles.stopButton}
                                        onPress={() => handleStopSession(session.id)}
                                    >
                                        <MaterialIcons name="stop-circle" size={20} color="#FFF" />
                                        <Text style={styles.stopButtonText}>Stop</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card>
            )}

            {/* Class Statistics */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="insert-chart" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Class Statistics</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="book-education" size={32} color={colors.primary} />
                        <Text style={styles.statValue}>{classStatistics.totalClasses}</Text>
                        <Text style={styles.statLabel}>Total Classes</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="access-point" size={32} color={colors.success} />
                        <Text style={styles.statValue}>{classStatistics.activeSessions}</Text>
                        <Text style={styles.statLabel}>Active Sessions</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="account-group" size={32} color={colors.warning} />
                        <Text style={styles.statValue}>{classStatistics.totalStudents}</Text>
                        <Text style={styles.statLabel}>Total Students</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="chart-line" size={32} color={colors.primary} />
                        <Text style={styles.statValue}>{classStatistics.averageAttendance}</Text>
                        <Text style={styles.statLabel}>Avg. Attendance</Text>
                    </View>
                </View>
            </Card>

            {/* Recent Activities */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="history" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Recent Activities</Text>
                </View>
                {recentActivities.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                        <View style={[styles.activityIcon, { backgroundColor: activity.color + '15' }]}>
                            <MaterialIcons name={activity.icon as any} size={20} color={activity.color} />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>{activity.course}</Text>
                            <Text style={styles.activityTime}>{activity.time}</Text>
                            <Text style={styles.activityDetails}>
                                {activity.icon === 'play-circle-filled' ? 'Session started' :
                                    activity.icon === 'stop-circle' ? 'Session ended' :
                                        activity.icon === 'cloud-download' ? 'Attendance exported' :
                                            'Manual attendance update'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.activityAction}
                            onPress={() => {
                                if (activity.icon === 'play-circle-filled' || activity.icon === 'stop-circle') {
                                    router.push({
                                        pathname: '/session-details',
                                        params: { sessionId: activity.id.split('-')[1] }
                                    });
                                } else if (activity.icon === 'cloud-download') {
                                    // TODO: Implement download functionality
                                    Alert.alert('Not Implemented', 'Download functionality will be implemented soon');
                                }
                            }}
                        >
                            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => router.push('/activity-history' as any)}
                >
                    <Text style={styles.viewAllText}>View All Activities</Text>
                    <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
            </Card>

            {/* Quick Actions */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="flash-on" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('class-management' as any)}
                    >
                        <MaterialIcons name="people" size={24} color="#FFF" />
                        <Text style={styles.actionButtonText}>Manage Classes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('reports' as any)}
                    >
                        <MaterialIcons name="assessment" size={24} color="#FFF" />
                        <Text style={styles.actionButtonText}>View Reports</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.background,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    welcomeSection: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '300',
        color: colors.text,
        marginBottom: 8,
        lineHeight: 34,
    },
    nameText: {
        fontWeight: '700',
    },
    dateText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    profileSection: {
        alignItems: 'center',
    },
    profilePicture: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileBorder: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 34,
        borderWidth: 2,
        borderColor: colors.primary + '30',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    profileInitial: {
        fontSize: 26,
        fontWeight: '600',
        color: colors.primary,
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginLeft: 8,
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
    classCode: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 2,
        fontWeight: '600',
    },
    classDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    classStatus: {
        alignItems: 'flex-end',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    studentCount: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    sessionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sessionInfo: {
        flex: 1,
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
    sessionStats: {
        alignItems: 'flex-end',
    },
    attendanceText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    progressBar: {
        width: 80,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.success,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    statItem: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background,
        borderRadius: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.text,
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    activityDetails: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    activityAction: {
        padding: 8,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginTop: 8,
    },
    viewAllText: {
        fontSize: 14,
        color: colors.primary,
        marginRight: 4,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: colors.primary,
        borderRadius: 8,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFF',
    },
    noClassesText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        color: colors.error,
        textAlign: 'center',
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.error,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: 8,
        gap: 4,
    },
    stopButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
    },
}); 