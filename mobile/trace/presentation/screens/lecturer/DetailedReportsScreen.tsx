import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';

export const DetailedReportsScreen = observer(({ route }: { route: { params: { reportId: string } } }) => {
    const { authStore } = useStores();
        const user = authStore.state.user;
    const { reportId } = route.params as { reportId: string };

    // Mock data - replace with actual data from your backend
    const [reportData, setReportData] = useState({
        title: 'Data Structures - Week 1',
        date: '2024-03-15',
        totalStudents: 50,
        presentStudents: 45,
        absentStudents: 5,
        attendancePercentage: 90,
    });

    const [attendancePatterns, setAttendancePatterns] = useState([
        {
            id: '1',
            pattern: 'High Attendance',
            count: 35,
            percentage: 70,
        },
        {
            id: '2',
            pattern: 'Moderate Attendance',
            count: 10,
            percentage: 20,
        },
        {
            id: '3',
            pattern: 'Low Attendance',
            count: 5,
            percentage: 10,
        },
    ]);

    const [studentPerformance, setStudentPerformance] = useState([
        {
            id: '1',
            name: 'John Doe',
            attendance: 95,
            status: 'Excellent',
        },
        {
            id: '2',
            name: 'Jane Smith',
            attendance: 85,
            status: 'Good',
        },
        {
            id: '3',
            name: 'Bob Johnson',
            attendance: 75,
            status: 'Average',
        },
        {
            id: '4',
            name: 'Alice Brown',
            attendance: 65,
            status: 'Below Average',
        },
        {
            id: '5',
            name: 'Charlie Wilson',
            attendance: 55,
            status: 'Poor',
        },
    ]);

    useEffect(() => {
        // TODO: Fetch detailed report data
    }, [reportId]);

    const handleGenerateCustomReport = () => {
        // TODO: Implement custom report generation
        Alert.alert('Generate Custom Report', 'Generating custom report...');
    };

    const handleExportReport = () => {
        // TODO: Implement report export
        Alert.alert('Export Report', 'Exporting report...');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Report Overview */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Report Overview</Text>
                <View style={styles.overviewGrid}>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Title</Text>
                        <Text style={styles.overviewValue}>{reportData.title}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Date</Text>
                        <Text style={styles.overviewValue}>{reportData.date}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Total Students</Text>
                        <Text style={styles.overviewValue}>{reportData.totalStudents}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Present Students</Text>
                        <Text style={styles.overviewValue}>{reportData.presentStudents}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Absent Students</Text>
                        <Text style={styles.overviewValue}>{reportData.absentStudents}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Attendance Percentage</Text>
                        <Text style={styles.overviewValue}>{reportData.attendancePercentage}%</Text>
                    </View>
                </View>
            </Card>

            {/* Attendance Patterns */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Attendance Patterns</Text>
                {attendancePatterns.map((pattern) => (
                    <View key={pattern.id} style={styles.patternItem}>
                        <Text style={styles.patternTitle}>{pattern.pattern}</Text>
                        <Text style={styles.patternCount}>{pattern.count} students</Text>
                        <Text style={styles.patternPercentage}>{pattern.percentage}%</Text>
                    </View>
                ))}
            </Card>

            {/* Student Performance */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Student Performance</Text>
                {studentPerformance.map((student) => (
                    <View key={student.id} style={styles.studentItem}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentAttendance}>{student.attendance}%</Text>
                        <Text style={styles.studentStatus}>{student.status}</Text>
                    </View>
                ))}
            </Card>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleGenerateCustomReport}
                >
                    <Text style={styles.actionButtonText}>Generate Custom Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleExportReport}
                >
                    <Text style={styles.actionButtonText}>Export Report</Text>
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
    section: {
        margin: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    overviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    overviewItem: {
        width: '48%',
        marginBottom: 16,
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
    patternItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    patternTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    patternCount: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    patternPercentage: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
    },
    studentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    studentAttendance: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    studentStatus: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
    },
    actions: {
        padding: 16,
    },
    actionButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
}); 