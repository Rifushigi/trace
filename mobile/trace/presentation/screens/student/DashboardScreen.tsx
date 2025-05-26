import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { StudentStackScreenProps } from '../../../navigation/types';

type Props = StudentStackScreenProps<'Dashboard'>;

export const DashboardScreen = observer(({ navigation }: Props) => {
    const { authStore } = useStores();
    const user = authStore.authState.user;

    // TODO: Add hooks for fetching schedule, attendance stats, and notifications

    return (
        <ScrollView style={styles.container}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>
                    Welcome back, {user?.firstName}!
                </Text>
                <Text style={styles.dateText}>
                    {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </Text>
            </View>

            {/* Today's Schedule */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
                <View style={styles.scheduleList}>
                    {/* TODO: Map through today's classes */}
                    <Text style={styles.emptyText}>No classes scheduled for today</Text>
                </View>
            </Card>

            {/* Current Class Status */}
            <TouchableOpacity
                onPress={() => navigation.navigate('AttendanceStatus')}
                activeOpacity={0.7}
            >
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Current Class Status</Text>
                    <View style={styles.statusContainer}>
                        <View style={styles.statusItem}>
                            <Text style={styles.statusLabel}>Face Recognition</Text>
                            <View style={[styles.statusIndicator, styles.statusInactive]} />
                        </View>
                        <View style={styles.statusItem}>
                            <Text style={styles.statusLabel}>NFC</Text>
                            <View style={[styles.statusIndicator, styles.statusInactive]} />
                        </View>
                        <View style={styles.statusItem}>
                            <Text style={styles.statusLabel}>BLE</Text>
                            <View style={[styles.statusIndicator, styles.statusInactive]} />
                        </View>
                        <View style={styles.statusItem}>
                            <Text style={styles.statusLabel}>Location</Text>
                            <View style={[styles.statusIndicator, styles.statusInactive]} />
                        </View>
                    </View>
                    <Text style={styles.viewDetailsText}>Tap to view details</Text>
                </Card>
            </TouchableOpacity>

            {/* Attendance Statistics */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Attendance Statistics</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0%</Text>
                        <Text style={styles.statLabel}>This Week</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0%</Text>
                        <Text style={styles.statLabel}>This Month</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0%</Text>
                        <Text style={styles.statLabel}>Overall</Text>
                    </View>
                </View>
            </Card>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Schedule')}
                >
                    <Text style={styles.actionButtonText}>View Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('AttendanceHistory')}
                >
                    <Text style={styles.actionButtonText}>Attendance History</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    welcomeSection: {
        padding: 20,
        backgroundColor: colors.primary,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
    },
    section: {
        margin: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: colors.text,
    },
    scheduleList: {
        minHeight: 100,
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    statusItem: {
        alignItems: 'center',
        width: '25%',
    },
    statusLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statusActive: {
        backgroundColor: colors.success,
    },
    statusInactive: {
        backgroundColor: colors.error,
    },
    viewDetailsText: {
        textAlign: 'center',
        color: colors.primary,
        marginTop: 12,
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    quickActions: {
        flexDirection: 'row',
        padding: 16,
        gap: 16,
    },
    actionButton: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 