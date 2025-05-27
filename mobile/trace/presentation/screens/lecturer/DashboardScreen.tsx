import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, Image, Animated, Pressable } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { Lecturer } from '../../../domain/entities/User';
import { router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export const DashboardScreen = observer(() => {
    const { authStore } = useStores();
    const user = authStore.state.user as Lecturer;
    const [refreshing, setRefreshing] = React.useState(false);
    const [clickCount, setClickCount] = React.useState(0);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    const startPulseAnimation = React.useCallback(() => {
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

    React.useEffect(() => {
        startPulseAnimation();
    }, [startPulseAnimation]);

    // Mock data - replace with actual data from your backend
    const todayClasses = [
        { id: '1', course: 'Computer Science 101', time: '09:00 - 10:30', room: 'Room 101', status: 'upcoming', students: 45 },
        { id: '2', course: 'Data Structures', time: '11:00 - 12:30', room: 'Room 202', status: 'active', students: 50 },
        { id: '3', course: 'Algorithms', time: '14:00 - 15:30', room: 'Room 303', status: 'completed', students: 38 },
    ];

    const activeSessions = [
        { id: '1', course: 'Data Structures', startTime: '11:00', attendance: '45/50', progress: 90 },
    ];

    const recentActivities = [
        { id: '1', type: 'session_started', course: 'Data Structures', time: '11:00 AM', icon: 'play-circle-filled', color: colors.success },
        { id: '2', type: 'session_ended', course: 'Computer Science 101', time: '10:30 AM', icon: 'stop-circle', color: colors.error },
        { id: '3', type: 'attendance_exported', course: 'Algorithms', time: 'Yesterday', icon: 'cloud-download', color: colors.success },
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

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 16,
            }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeText}>
                            Good morning,{'\n'}
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
                    <MaterialIcons name="class" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Today&apos;s Classes</Text>
                </View>
                {todayClasses.map((classItem) => (
                    <TouchableOpacity
                        key={classItem.id}
                        style={styles.classItem}
                        onPress={() => handleViewClassDetails(classItem.id)}
                    >
                        <View style={styles.classInfo}>
                            <Text style={styles.className}>{classItem.course}</Text>
                            <Text style={styles.classDetails}>
                                <MaterialIcons name="access-time" size={14} color={colors.textSecondary} />
                                {' '}{classItem.time} • {classItem.room} • {classItem.students} students
                            </Text>
                        </View>
                        <View style={[
                            styles.statusBadge,
                            classItem.status === 'active' ? styles.activeBadge :
                            classItem.status === 'upcoming' ? styles.upcomingBadge :
                            styles.completedBadge
                        ]}>
                            <Text style={styles.statusText}>
                                {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </Card>

            {/* Active Sessions */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="wifi-tethering" size={24} color={colors.primary} />
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
                                Started at {session.startTime} • {session.attendance} students
                            </Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${session.progress}%` }]} />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => handleStartSession(session.id)}
                        >
                            <MaterialIcons name="settings" size={20} color="#FFF" />
                            <Text style={styles.controlButtonText}>Control</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </Card>

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

            {/* Recent Activities */}
            <Card style={styles.section}>
                <View style={styles.activityHeader}>
                    <MaterialIcons name="notifications" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Recent Activities</Text>
                </View>
                <View>
                    {recentActivities.map((activity) => (
                        <View key={activity.id} style={styles.activityItem}>
                            <View style={styles.activityIconContainer}>
                                <MaterialIcons name={activity.icon as any} size={24} color={activity.color} />
                            </View>
                            <View style={styles.activityContent}>
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
                </View>
                    <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={[styles.viewAllText, { color: '#666666' }]}>View All Activities</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#666666" />
                </TouchableOpacity>
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
    timeText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
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
    classDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    activeBadge: {
        backgroundColor: colors.success + '20',
    },
    upcomingBadge: {
        backgroundColor: colors.warning + '20',
    },
    completedBadge: {
        backgroundColor: colors.primary + '20',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.text,
    },
    sessionItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sessionInfo: {
        marginBottom: 12,
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
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.success,
    },
    controlButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    controlButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    statItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginVertical: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    activityIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityType: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 2,
    },
    activityDetails: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    activityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
        logoutButton: {
        padding: 8,
        marginBottom: 8,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginTop: 16,
    },
    viewAllText: {
        fontSize: 14,
        marginRight: 4,
    },
}); 