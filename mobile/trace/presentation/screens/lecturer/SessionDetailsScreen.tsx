import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Card } from '../../components/Card';
import { colors } from '@/shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { features } from '@/config/features';
import { getMockAttendanceSession } from '@/presentation/mocks/attendanceManagementMock';

type AttendanceStatus = 'all' | 'present' | 'late' | 'absent';

export const SessionDetailsScreen = observer(() => {
    const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<AttendanceStatus>('all');

    useEffect(() => {
        const fetchSessionDetails = async () => {
            if (features.useMockApi) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                const sessionDetails = getMockAttendanceSession(sessionId);
                setSession(sessionDetails);
            }
            setLoading(false);
        };

        fetchSessionDetails();
    }, [sessionId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!session) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Session not found</Text>
            </View>
        );
    }

    const calculateStats = () => {
        const total = session.records.length;
        const present = session.records.filter((r: { status: string }) => r.status === 'present').length;
        const late = session.records.filter((r: { status: string }) => r.status === 'late').length;
        const absent = session.records.filter((r: { status: string }) => r.status === 'absent').length;
        const attendanceRate = (present / total) * 100;

        return { total, present, late, absent, attendanceRate };
    };

    const stats = calculateStats();

    const filteredRecords = session.records.filter((record: { status: string }) => 
        statusFilter === 'all' || record.status === statusFilter
    );

    const FilterButton = ({ status, label }: { status: AttendanceStatus; label: string }) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                statusFilter === status && styles.filterButtonActive
            ]}
            onPress={() => setStatusFilter(status)}
        >
            <Text style={[
                styles.filterButtonText,
                statusFilter === status && styles.filterButtonTextActive
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Session Overview */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Session Overview</Text>
                <View style={styles.overviewGrid}>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Course</Text>
                        <Text style={styles.overviewValue}>{session.class.name}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Date</Text>
                        <Text style={styles.overviewValue}>
                            {format(session.date, 'MMMM d, yyyy')}
                        </Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Time</Text>
                        <Text style={styles.overviewValue}>
                            {format(session.startTime, 'h:mm a')} - {format(session.endTime, 'h:mm a')}
                        </Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Status</Text>
                        <Text style={[styles.overviewValue, { color: colors.success }]}>
                            {session.status}
                        </Text>
                    </View>
                </View>
            </Card>

            {/* Attendance Statistics */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Attendance Statistics</Text>
                <View style={styles.statsGrid}>
                    <View style={[styles.statItem, styles.presentStat]}>
                        <Text style={styles.statValue}>{stats.present}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={[styles.statItem, styles.lateStat]}>
                        <Text style={styles.statValue}>{stats.late}</Text>
                        <Text style={styles.statLabel}>Late</Text>
                    </View>
                    <View style={[styles.statItem, styles.absentStat]}>
                        <Text style={styles.statValue}>{stats.absent}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                </View>
                <View style={styles.attendanceRate}>
                    <Text style={styles.rateValue}>{Math.round(stats.attendanceRate)}%</Text>
                    <Text style={styles.rateLabel}>Attendance Rate</Text>
                </View>
            </Card>

            {/* Student List */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Student List</Text>
                <View style={styles.filterContainer}>
                    <FilterButton status="all" label="All" />
                    <FilterButton status="present" label="Present" />
                    <FilterButton status="late" label="Late" />
                    <FilterButton status="absent" label="Absent" />
                </View>
                {filteredRecords.map((record: any) => (
                    <View key={record.student.id} style={styles.studentItem}>
                        <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>
                                {record.student.firstName} {record.student.lastName}
                            </Text>
                            <Text style={styles.studentId}>{record.student.matricNo}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                            <Text style={styles.statusText}>{record.status}</Text>
                        </View>
        </View>
                ))}
            </Card>

            {/* Export Options */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Export Options</Text>
                <TouchableOpacity style={styles.exportButton}>
                    <MaterialIcons name="file-download" size={24} color={colors.primary} />
                    <Text style={styles.exportButtonText}>Export as PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportButton}>
                    <MaterialIcons name="table-chart" size={24} color={colors.primary} />
                    <Text style={styles.exportButtonText}>Export as Excel</Text>
                </TouchableOpacity>
            </Card>
        </ScrollView>
    );
});

const getStatusColor = (status: string) => {
    switch (status) {
        case 'present':
            return colors.success;
        case 'late':
            return colors.warning;
        case 'absent':
            return colors.error;
        default:
            return colors.textSecondary;
    }
};

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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    errorText: {
        fontSize: 16,
        color: colors.error,
    },
    section: {
        margin: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    overviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    overviewItem: {
        flex: 1,
        minWidth: '45%',
    },
    overviewLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    overviewValue: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    presentStat: {
        backgroundColor: colors.success + '20',
    },
    lateStat: {
        backgroundColor: colors.warning + '20',
    },
    absentStat: {
        backgroundColor: colors.error + '20',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    attendanceRate: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background,
        borderRadius: 8,
    },
    rateValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    rateLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterButtonText: {
        fontSize: 14,
        color: colors.text,
    },
    filterButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    studentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    studentId: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background,
        borderRadius: 8,
        marginBottom: 12,
    },
    exportButtonText: {
        fontSize: 16,
        color: colors.primary,
        marginLeft: 12,
    },
}); 