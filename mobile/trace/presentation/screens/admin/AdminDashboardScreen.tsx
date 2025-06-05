import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '@/presentation/components/Card';
import { colors } from '@/shared/constants/theme';
import { router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRefresh } from '@/presentation/hooks/useRefresh';
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';
import { features } from '@/config/features';
import { getMockAdminDashboardData } from '@/presentation/mocks/adminDashboardMock';

export const AdminDashboardScreen = observer(() => {
    const { handleError, isConnected } = useErrorHandler({
        showErrorAlert: true,
        onNetworkError: (error) => {
            Alert.alert('Network Error', 'Please check your internet connection');
        }
    });

    const [systemStatus, setSystemStatus] = useState(getMockAdminDashboardData().systemStatus);
    const [userStatistics, setUserStatistics] = useState(getMockAdminDashboardData().userStatistics);
    const [recentActivities, setRecentActivities] = useState(getMockAdminDashboardData().recentActivities);

    const { refreshing, handleRefresh } = useRefresh({
        onRefresh: async () => {
            await handleError(async () => {
                if (features.useMockApi) {
                    const mockData = getMockAdminDashboardData();
                    setSystemStatus(mockData.systemStatus);
                    setUserStatistics(mockData.userStatistics);
                    setRecentActivities(mockData.recentActivities);
                    return;
                }
                // TODO: Implement refresh logic for dashboard data
                await Promise.all([
                    // Add your refresh operations here
                ]);
            }, 'Failed to refresh dashboard data');
        }
    });

    useEffect(() => {
        if (isConnected || features.useMockApi) {
            handleRefresh();
        }
    }, [handleRefresh, isConnected]);

    const handleQuickAction = (action: string) => {
        if (!isConnected && !features.useMockApi) {
            return;
        }

        switch (action) {
            case 'manage_users':
                router.push('/(admin)/user-management');
                break;
            case 'view_reports':
                router.push('/(admin)/reports');
                break;
            case 'system_settings':
                router.push('/(admin)/system-settings');
                break;
            case 'backup':
                Alert.alert('Backup', 'Starting system backup...');
                break;
            default:
                break;
        }
    };

    const getStatusColor = (value: string) => {
        const numValue = parseInt(value);
        if (numValue < 50) return colors.success;
        if (numValue > 60 && numValue < 80) return colors.warning;
        if (numValue > 80) return colors.error;
        return colors.success; 
    };

    const getUptimeColor = (value: string) => {
        const numValue = parseInt(value);
            if (numValue <= 75) return colors.error;
            if (numValue < 85 && numValue > 75) return colors.warning;
            if (numValue > 85) return colors.success;
        return colors.error; 
    };

    return (
        <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: 16,
            }}
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            {/* System Health */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="health-and-safety" size={24} color={colors.primary} />
                    <Text style={styles.sectionTitle}>System Health</Text>
                </View>
                <View style={styles.healthGrid}>
                    <View style={styles.healthItem}>
                        <Text style={styles.healthLabel}>CPU Usage</Text>
                        <Text style={[styles.healthValue, { color: getStatusColor(systemStatus.cpuUsage) }]}>
                            {systemStatus.cpuUsage}
                        </Text>
                    </View>
                    <View style={styles.healthItem}>
                        <Text style={styles.healthLabel}>Memory</Text>
                        <Text style={[styles.healthValue, { color: getStatusColor(systemStatus.memoryUsage) }]}>
                            {systemStatus.memoryUsage}
                        </Text>
                    </View>
                    <View style={styles.healthItem}>
                        <Text style={styles.healthLabel}>Storage</Text>
                        <Text style={[styles.healthValue, { color: getStatusColor(systemStatus.storageUsage) }]}>
                            {systemStatus.storageUsage}
                        </Text>
                    </View>
                    <View style={styles.healthItem}>
                        <Text style={styles.healthLabel}>Uptime</Text>
                        <Text style={[styles.healthValue, { color: getUptimeColor(systemStatus.uptime) }]}>
                            {systemStatus.uptime}
                        </Text>
                    </View>
                </View>
            </Card>

            {/* User Statistics */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="people" size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>User Statistics</Text>
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="account-group" size={32} color={colors.primary} />
                        <Text style={styles.statValue}>{userStatistics.totalUsers}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="account-check" size={32} color={colors.success} />
                        <Text style={styles.statValue}>{userStatistics.activeUsers}</Text>
                        <Text style={styles.statLabel}>Active Users</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="account-plus" size={32} color={colors.primary} />
                        <Text style={styles.statValue}>{userStatistics.newUsers}</Text>
                        <Text style={styles.statLabel}>New Users</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="account-clock" size={32} color={colors.warning} />
                        <Text style={styles.statValue}>{userStatistics.pendingApprovals}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
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
                        onPress={() => handleQuickAction('manage_users')}
                    >
                        <MaterialIcons name="people" size={24} color="#FFF" />
                        <Text style={styles.actionButtonText}>Manage Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleQuickAction('view_reports')}
                    >
                        <MaterialIcons name="assessment" size={24} color="#FFF" />
                        <Text style={styles.actionButtonText}>Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleQuickAction('system_settings')}
                    >
                        <MaterialIcons name="settings" size={24} color="#FFF" />
                        <Text style={styles.actionButtonText}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleQuickAction('backup')}
                    >
                        <MaterialIcons name="backup" size={24} color="#FFF" />
                        <Text style={styles.actionButtonText}>Backup</Text>
                    </TouchableOpacity>
                </View>
            </Card>

            {/* Recent Activities */}
            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="notifications" size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                </View>
                {recentActivities.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                        <View style={[styles.activityIcon, { backgroundColor: '#F5F5F5' }]}>
                            <MaterialIcons name={activity.icon as any} size={20} color={activity.color} />
                        </View>
                        <View style={styles.activityContent}>
                        <Text style={styles.activityDescription}>
                            {activity.description}
                        </Text>
                        <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                        </View>
                    </View>
                ))}
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
    section: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginLeft: 8,
    },
    healthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    healthItem: {
        width: '48%',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    healthLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    healthValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginVertical: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666666',
    },
    actionsGrid: {
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
        flexDirection: 'column',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    activityIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityDescription: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 4,
    },
    activityTimestamp: {
        fontSize: 12,
        color: '#666666',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        padding: 8,
    },
    viewAllText: {
        fontSize: 14,
        marginRight: 4,
    },
}); 