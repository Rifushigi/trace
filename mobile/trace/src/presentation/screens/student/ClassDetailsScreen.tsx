import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { StudentStackScreenProps } from '../../../navigation/types';

type Props = StudentStackScreenProps<'ClassDetails'>;

// Mock data for demonstration
const mockClassDetails = {
    id: '1',
    courseName: 'Introduction to Computer Science',
    courseCode: 'CS101',
    lecturer: {
        name: 'Dr. John Smith',
        email: 'john.smith@university.edu',
        office: 'Room 301',
    },
    schedule: {
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 101',
    },
    attendance: {
        total: 15,
        present: 12,
        absent: 2,
        late: 1,
    },
    materials: [
        {
            id: '1',
            title: 'Course Syllabus',
            type: 'PDF',
            date: '2024-01-15',
        },
        {
            id: '2',
            title: 'Week 1 Lecture Notes',
            type: 'PDF',
            date: '2024-01-16',
        },
        {
            id: '3',
            title: 'Assignment 1',
            type: 'DOC',
            date: '2024-01-20',
        },
    ],
};

export const ClassDetailsScreen = observer(({ route, navigation }: Props) => {
    const { classId } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [classDetails, setClassDetails] = useState(mockClassDetails);

    useEffect(() => {
        // TODO: Fetch class details from API
        const fetchClassDetails = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setClassDetails(mockClassDetails);
            } catch (error) {
                console.error('Error fetching class details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassDetails();
    }, [classId]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading class details...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Course Information */}
            <Card style={styles.section}>
                <Text style={styles.courseName}>{classDetails.courseName}</Text>
                <Text style={styles.courseCode}>{classDetails.courseCode}</Text>
            </Card>

            {/* Lecturer Details */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Lecturer Information</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{classDetails.lecturer.name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{classDetails.lecturer.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Office:</Text>
                    <Text style={styles.value}>{classDetails.lecturer.office}</Text>
                </View>
            </Card>

            {/* Schedule Information */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Schedule</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Day:</Text>
                    <Text style={styles.value}>{classDetails.schedule.day}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Time:</Text>
                    <Text style={styles.value}>
                        {classDetails.schedule.startTime} - {classDetails.schedule.endTime}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Room:</Text>
                    <Text style={styles.value}>{classDetails.schedule.room}</Text>
                </View>
            </Card>

            {/* Attendance History */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Attendance History</Text>
                <View style={styles.attendanceStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{classDetails.attendance.present}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{classDetails.attendance.absent}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{classDetails.attendance.late}</Text>
                        <Text style={styles.statLabel}>Late</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.viewMoreButton}
                    onPress={() => navigation.navigate('AttendanceHistory')}
                >
                    <Text style={styles.viewMoreText}>View Detailed History</Text>
                </TouchableOpacity>
            </Card>

            {/* Course Materials */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Course Materials</Text>
                {classDetails.materials.map((material) => (
                    <TouchableOpacity
                        key={material.id}
                        style={styles.materialItem}
                        onPress={() => {
                            // TODO: Implement material download/view
                        }}
                    >
                        <View style={styles.materialInfo}>
                            <Text style={styles.materialTitle}>{material.title}</Text>
                            <Text style={styles.materialMeta}>
                                {material.type} • {material.date}
                            </Text>
                        </View>
                        <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                ))}
            </Card>
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
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.textSecondary,
    },
    section: {
        margin: 16,
        padding: 16,
    },
    courseName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    courseCode: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 80,
        fontSize: 16,
        color: colors.textSecondary,
    },
    value: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    attendanceStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    viewMoreButton: {
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    viewMoreText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
    },
    materialItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    materialInfo: {
        flex: 1,
    },
    materialTitle: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 4,
    },
    materialMeta: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    downloadText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
}); 