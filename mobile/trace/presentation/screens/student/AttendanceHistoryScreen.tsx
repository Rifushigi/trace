import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { getMockClasses } from '../../mocks/classMock';
import { getMockSchedule } from '../../mocks/scheduleMock';

type AttendanceStatus = 'present' | 'late' | 'absent';

type AttendanceRecord = {
    id: string;
    courseName: string;
    date: string;
    status: AttendanceStatus;
    time: string;
    verificationMethod: string;
};

// Generate mock attendance records from class and schedule data
const generateMockAttendanceRecords = (): AttendanceRecord[] => {
    const classes = getMockClasses();
    const schedules = getMockSchedule();
    const records: AttendanceRecord[] = [];

    // Generate records for the past 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        // Find classes scheduled for this day
        const daySchedules = schedules.filter(schedule => schedule.schedule.day === dayName);

        daySchedules.forEach(schedule => {
            const classDetails = classes.find(cls => cls.id === schedule.id);
            if (classDetails) {
                // Generate random attendance status
                const statuses: AttendanceStatus[] = ['present', 'late', 'absent'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const verificationMethods = ['Face Recognition', 'Manual'];

                records.push({
                    id: `${schedule.id}-${date.toISOString()}`,
                    courseName: schedule.course,
                    date: date.toISOString().split('T')[0],
                    status,
                    time: schedule.schedule.startTime,
                    verificationMethod: verificationMethods[Math.floor(Math.random() * verificationMethods.length)]
                });
            }
        });
    }

    return records;
};

const mockAttendanceRecords = generateMockAttendanceRecords();

const statusColors: Record<AttendanceStatus, string> = {
    present: colors.success,
    late: colors.warning,
    absent: colors.error,
};

export const AttendanceHistoryScreen = observer(() => {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | null>(null);

    // Get unique courses for filter
    const courses = Array.from(new Set(mockAttendanceRecords.map(record => record.courseName)));

    // Filter records based on selected filters
    const filteredRecords = mockAttendanceRecords.filter(record => {
        if (selectedCourse && record.courseName !== selectedCourse) return false;
        if (selectedStatus && record.status !== selectedStatus) return false;
        return true;
    });

    // Calculate attendance statistics
    const totalClasses = mockAttendanceRecords.length;
    const presentCount = mockAttendanceRecords.filter(r => r.status === 'present').length;
    const lateCount = mockAttendanceRecords.filter(r => r.status === 'late').length;
    const absentCount = mockAttendanceRecords.filter(r => r.status === 'absent').length;
    const attendancePercentage = Math.round((presentCount / totalClasses) * 100);

    return (
        <ScrollView style={styles.container}>
            {/* Attendance Statistics */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Overall Attendance</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{attendancePercentage}%</Text>
                        <Text style={styles.statLabel}>Attendance Rate</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{presentCount}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{lateCount}</Text>
                        <Text style={styles.statLabel}>Late</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{absentCount}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                </View>
            </Card>

            {/* Filters */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Filters</Text>
                <View style={styles.filtersContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                !selectedCourse && styles.selectedFilterButton,
                            ]}
                            onPress={() => setSelectedCourse(null)}
                        >
                            <Text style={[
                                styles.filterButtonText,
                                !selectedCourse && styles.selectedFilterButtonText,
                            ]}>
                                All Courses
                            </Text>
                        </TouchableOpacity>
                        {courses.map((course) => (
                            <TouchableOpacity
                                key={course}
                                style={[
                                    styles.filterButton,
                                    selectedCourse === course && styles.selectedFilterButton,
                                ]}
                                onPress={() => setSelectedCourse(course)}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    selectedCourse === course && styles.selectedFilterButtonText,
                                ]}>
                                    {course}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.statusFilters}>
                        <TouchableOpacity
                            style={[
                                styles.statusFilterButton,
                                !selectedStatus && styles.selectedStatusFilterButton,
                            ]}
                            onPress={() => setSelectedStatus(null)}
                        >
                            <Text style={[
                                styles.statusFilterText,
                                !selectedStatus && styles.selectedStatusFilterText,
                            ]}>
                                All
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.statusFilterButton,
                                selectedStatus === 'present' && styles.selectedStatusFilterButton,
                            ]}
                            onPress={() => setSelectedStatus('present')}
                        >
                            <Text style={[
                                styles.statusFilterText,
                                selectedStatus === 'present' && styles.selectedStatusFilterText,
                            ]}>
                                Present
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.statusFilterButton,
                                selectedStatus === 'late' && styles.selectedStatusFilterButton,
                            ]}
                            onPress={() => setSelectedStatus('late')}
                        >
                            <Text style={[
                                styles.statusFilterText,
                                selectedStatus === 'late' && styles.selectedStatusFilterText,
                            ]}>
                                Late
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.statusFilterButton,
                                selectedStatus === 'absent' && styles.selectedStatusFilterButton,
                            ]}
                            onPress={() => setSelectedStatus('absent')}
                        >
                            <Text style={[
                                styles.statusFilterText,
                                selectedStatus === 'absent' && styles.selectedStatusFilterText,
                            ]}>
                                Absent
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>

            {/* Attendance Records */}
            <View style={styles.recordsSection}>
                <Text style={styles.sectionTitle}>Attendance Records</Text>
                {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                        <Card key={record.id} style={styles.recordItem}>
                            <View style={styles.recordHeader}>
                                <Text style={styles.courseName}>{record.courseName}</Text>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: statusColors[record.status] },
                                ]}>
                                    <Text style={styles.statusText}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.recordDetails}>
                                <Text style={styles.recordText}>Date: {record.date}</Text>
                                <Text style={styles.recordText}>Time: {record.time}</Text>
                                <Text style={styles.recordText}>
                                    Verified by: {record.verificationMethod}
                                </Text>
                            </View>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No attendance records found</Text>
                )}
            </View>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    filtersContainer: {
        gap: 12,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: 8,
    },
    selectedFilterButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterButtonText: {
        fontSize: 14,
        color: colors.text,
    },
    selectedFilterButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    statusFilters: {
        flexDirection: 'row',
        gap: 8,
    },
    statusFilterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectedStatusFilterButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    statusFilterText: {
        fontSize: 12,
        color: colors.text,
    },
    selectedStatusFilterText: {
        color: '#fff',
        fontWeight: '500',
    },
    recordsSection: {
        padding: 16,
    },
    recordItem: {
        marginBottom: 12,
        padding: 16,
    },
    recordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    courseName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    recordDetails: {
        gap: 4,
    },
    recordText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: 32,
    },
}); 