import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, Image, Animated, Pressable } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Student } from '../../../domain/entities/User';
import { router } from 'expo-router';
import { getStatusColor } from '@/utils/reuseables';

const CARD_MARGIN = 12;

type ClassStatus = 'active' | 'upcoming' | 'completed';

interface ClassItem {
    id: string;
    course: string;
    time: string;
    room: string;
    status: ClassStatus;
    instructor: string;
}

export const DashboardScreen = observer(() => {
    const { authStore } = useStores();
    const user = authStore.state.user as Student;
    const [refreshing, setRefreshing] = React.useState(false);
    const [clickCount, setClickCount] = React.useState(0);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    const startPulseAnimation = React.useCallback(() => {
        if (clickCount >= 10) return;
        
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
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

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // TODO: Implement refresh logic
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    // Mock data - replace with actual data
    const todayClasses: ClassItem[] = [
        {
            id: '1',
            course: 'Data Structures & Algorithms',
            time: '09:00 - 10:30',
            room: 'Room 101',
            status: 'upcoming',
            instructor: 'Dr. Smith'
        },
        {
            id: '2',
            course: 'Advanced Algorithms',
            time: '11:00 - 12:30',
            room: 'Room 202',
            status: 'active',
            instructor: 'Prof. Johnson'
        }
    ];

    const attendanceStats = {
        weekly: 85,
        monthly: 90,
        overall: 88
    };



    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh}
                    tintColor={colors.primary}
                    colors={[colors.primary]}
                />
            }
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
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

            {/* Attendance Stats */}
            <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Attendance Overview</Text>
                <View style={styles.statsGrid}>
                    <Card 
                        variant='elevated'
                        style={styles.statsCard} 
                       
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <MaterialCommunityIcons name="calendar-week" size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.statsValue, { color: colors.primary }]}>{attendanceStats.weekly}%</Text>
                        <Text style={styles.statsLabel}>This Week</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { 
                                width: `${attendanceStats.weekly}%`, 
                                backgroundColor: colors.primary 
                            }]} />
                        </View>
                    </Card>
                    
                    <Card 
                        variant='elevated'
                        style={styles.statsCard}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <MaterialCommunityIcons name="calendar-month" size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.statsValue, { color: colors.primary }]}>{attendanceStats.monthly}%</Text>
                        <Text style={styles.statsLabel}>This Month</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { 
                                width: `${attendanceStats.monthly}%`, 
                                backgroundColor: colors.primary 
                            }]} />
                        </View>
                    </Card>
                    
                    <Card 
                        variant='elevated'
                        style={styles.statsCard}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                            <MaterialCommunityIcons name="chart-line" size={20} color={colors.primary}  />
                        </View>
                        <Text style={[styles.statsValue, { color: colors.primary }]}>{attendanceStats.overall}%</Text>
                        <Text style={styles.statsLabel}>Overall</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { 
                                width: `${attendanceStats.overall}%`, 
                                backgroundColor: colors.primary 
                            }]} />
                        </View>
                    </Card>
                </View>
            </View>

            {/* Today's Schedule */}
        <Card style={styles.section}>
        <View style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: '#8B5CF6' + '15',  marginBottom: 0 }]}>
                        <MaterialIcons name="schedule" size={18} color={colors.primary} />
                    </View>
                    <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <MaterialIcons name="arrow-forward-ios" size={14} color={colors.primary} />
                </TouchableOpacity>
            </View>
        
        <View style={styles.scheduleList}>
            {todayClasses.length > 0 ? (
                todayClasses.map((classItem, index) => (
                    <TouchableOpacity
                        key={classItem.id}
                        style={[
                            styles.classItem,
                            index === todayClasses.length - 1 && styles.lastClassItem
                        ]}
                        onPress={() => router.push({
                            pathname: '/class-details',
                            params: { classId: classItem.id }
                        })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.classTimeIndicator}>
                            <View style={[styles.timeIndicatorDot, { 
                                backgroundColor: getStatusColor(classItem.status) 
                            }]} />
                            <Text style={styles.classTime}>{classItem.time}</Text>
                        </View>
                        
                        <View style={styles.classMainContent}>
                            <View style={styles.classInfo}>
                                <Text style={styles.className}>{classItem.course}</Text>
                                <View style={styles.classMetaRow}>
                                    <View style={styles.classMeta}>
                                        <MaterialIcons name="room" size={14} color={colors.textSecondary} />
                                        <Text style={styles.classMetaText}>{classItem.room}</Text>
                                    </View>
                                    <View style={styles.classMeta}>
                                        <MaterialIcons name="person" size={14} color={colors.textSecondary} />
                                        <Text style={styles.classMetaText}>{classItem.instructor}</Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={[styles.statusBadge, { 
                                backgroundColor: getStatusColor(classItem.status) + '15',
                                borderColor: getStatusColor(classItem.status) + '30'
                            }]}>
                                <View style={[styles.statusDot, { 
                                    backgroundColor: getStatusColor(classItem.status) 
                                }]} />
                                <Text style={[styles.statusText, { 
                                    color: getStatusColor(classItem.status) 
                                }]}>
                                    {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                        <MaterialCommunityIcons name="calendar-blank" size={48} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.emptyTitle}>No classes today</Text>
                    <Text style={styles.emptyText}>Enjoy your free day!</Text>
                </View>
            )}
        </View>
    </View>
</Card>
            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
                <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#6366F1' }]}
                        onPress={() => router.push('/attendance-status')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.actionIconContainer}>
                            <MaterialIcons name="qr-code-scanner" size={22} color="#FFF" />
                        </View>
                        <Text style={styles.actionButtonTitle}>Mark Attendance</Text>
                        <Text style={styles.actionButtonSubtitle}>Scan QR code</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                        onPress={() => router.push('/device-setup')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.actionIconContainer}>
                            <MaterialIcons name="settings" size={22} color="#FFF" />
                        </View>
                        <Text style={styles.actionButtonTitle}>Device Setup</Text>
                        <Text style={styles.actionButtonSubtitle}>Configure settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
     cardContent: {
        padding: 16,
    },
    contentContainer: {
        paddingBottom: 32,
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
    statsContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
        marginLeft: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: CARD_MARGIN,
    },
    statsCard: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statsValue: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 2,
    },
    statsLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 10,
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
   section: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // alignSelf: 'center',
        // alignContent: 'center', 
        marginBottom: 12,
        paddingBottom: 6,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
        // marginBottom: 10,
        color: colors.text,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 14,
        color: colors.primary,
        marginRight: 4,
        fontWeight: '500',
    },
    scheduleList: {
        
    },
    classItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    lastClassItem: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    classTimeIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        minWidth: 60,
    },
    timeIndicatorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    classTime: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 16,
    },
    classMainContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    classInfo: {
        flex: 1,
        marginRight: 12
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 6,
    },
    classMetaRow: {
        flexDirection: 'row',
        gap: 16,
    },
    classMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    classMetaText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginLeft: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 0,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyIconContainer: {
        padding: 16,
        backgroundColor: colors.textSecondary + '10',
        borderRadius: 32,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 14,
    },
    quickActionsContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
        marginTop: 16,
    },
    quickActionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
        marginLeft: 4,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionButtonTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    actionButtonSubtitle: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.9,
        textAlign: 'center',
    },
    logoutButton: {
        padding: 8,
        marginBottom: 8,
    },
});