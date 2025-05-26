import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { LecturerStackParamList } from '../../../navigation/types';
import { Lecturer } from '../../../domain/entities/User';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<LecturerStackParamList, 'StudentAnalytics'>;

export const StudentAnalyticsScreen = observer(({ navigation, route }: Props) => {
    const { authStore } = useStores();
    const user = authStore.authState.user as Lecturer;
    const { studentId } = route.params;

    // Mock data - replace with actual data from your backend
    const [studentData, setStudentData] = useState({
        name: 'John Doe',
        matricNo: '2024001',
        program: 'Computer Science',
        level: '200',
        totalClasses: 50,
        presentClasses: 45,
        absentClasses: 5,
        attendancePercentage: 90,
    });

    const [performanceMetrics, setPerformanceMetrics] = useState([
        {
            id: '1',
            metric: 'Attendance Rate',
            value: '90%',
            status: 'Excellent',
        },
        {
            id: '2',
            metric: 'Punctuality',
            value: '85%',
            status: 'Good',
        },
        {
            id: '3',
            metric: 'Participation',
            value: '80%',
            status: 'Good',
        },
    ]);

    const [historicalData, setHistoricalData] = useState([
        {
            id: '1',
            date: '2024-03-15',
            class: 'Data Structures',
            status: 'Present',
        },
        {
            id: '2',
            date: '2024-03-14',
            class: 'Algorithms',
            status: 'Present',
        },
        {
            id: '3',
            date: '2024-03-13',
            class: 'Database Systems',
            status: 'Absent',
        },
    ]);

    useEffect(() => {
        // TODO: Fetch student analytics data
    }, [studentId]);

    const handleGenerateReport = () => {
        // TODO: Implement report generation
        Alert.alert('Generate Report', 'Generating student report...');
    };

    const handleExportData = () => {
        // TODO: Implement data export
        Alert.alert('Export Data', 'Exporting student data...');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Student Overview */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Student Overview</Text>
                <View style={styles.overviewGrid}>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Name</Text>
                        <Text style={styles.overviewValue}>{studentData.name}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Matric No</Text>
                        <Text style={styles.overviewValue}>{studentData.matricNo}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Program</Text>
                        <Text style={styles.overviewValue}>{studentData.program}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Level</Text>
                        <Text style={styles.overviewValue}>{studentData.level}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Total Classes</Text>
                        <Text style={styles.overviewValue}>{studentData.totalClasses}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Present Classes</Text>
                        <Text style={styles.overviewValue}>{studentData.presentClasses}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Absent Classes</Text>
                        <Text style={styles.overviewValue}>{studentData.absentClasses}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Attendance Percentage</Text>
                        <Text style={styles.overviewValue}>{studentData.attendancePercentage}%</Text>
                    </View>
                </View>
            </Card>

            {/* Performance Metrics */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Performance Metrics</Text>
                {performanceMetrics.map((metric) => (
                    <View key={metric.id} style={styles.metricItem}>
                        <Text style={styles.metricTitle}>{metric.metric}</Text>
                        <Text style={styles.metricValue}>{metric.value}</Text>
                        <Text style={styles.metricStatus}>{metric.status}</Text>
                    </View>
                ))}
            </Card>

            {/* Historical Data */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Historical Data</Text>
                {historicalData.map((record) => (
                    <View key={record.id} style={styles.recordItem}>
                        <Text style={styles.recordDate}>{record.date}</Text>
                        <Text style={styles.recordClass}>{record.class}</Text>
                        <Text style={styles.recordStatus}>{record.status}</Text>
                    </View>
                ))}
            </Card>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleGenerateReport}
                >
                    <Text style={styles.actionButtonText}>Generate Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleExportData}
                >
                    <Text style={styles.actionButtonText}>Export Data</Text>
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
    metricItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    metricTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    metricValue: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    metricStatus: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
    },
    recordItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    recordDate: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    recordClass: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    recordStatus: {
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