import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { router } from 'expo-router';

export const ReportsDashboardScreen = observer(() => {
    const { authStore } = useStores();
    const user = authStore.state.user;

    // Mock data - replace with actual data from your backend
    const [overviewStats, setOverviewStats] = useState({
        totalClasses: 12,
        totalStudents: 450,
        averageAttendance: 85,
        totalSessions: 180,
    });

    const [quickReports, setQuickReports] = useState([
        {
            id: '1',
            title: 'Today\'s Attendance',
            value: '92%',
            change: '+5%',
            isPositive: true,
        },
        {
            id: '2',
            title: 'This Week\'s Attendance',
            value: '88%',
            change: '-2%',
            isPositive: false,
        },
        {
            id: '3',
            title: 'This Month\'s Attendance',
            value: '85%',
            change: '+3%',
            isPositive: true,
        },
    ]);

    const [recentReports, setRecentReports] = useState([
        {
            id: '1',
            title: 'Data Structures - Week 1',
            date: '2024-03-15',
            attendance: '90%',
        },
        {
            id: '2',
            title: 'Algorithms - Week 2',
            date: '2024-03-14',
            attendance: '85%',
        },
        {
            id: '3',
            title: 'Database Systems - Week 3',
            date: '2024-03-13',
            attendance: '88%',
        },
    ]);

    useEffect(() => {
        // TODO: Fetch reports data
    }, []);

    const handleGenerateReport = (type: string) => {
        // TODO: Implement report generation
        Alert.alert('Generate Report', `Generating ${type} report...`);
    };

    const handleViewDetailedReport = (reportId: string) => {
        router.push({
            pathname: '/reports',
            params: { id: reportId }
        });
    };

    const handleExportReport = (reportId: string) => {
        // TODO: Implement report export
        Alert.alert('Export Report', `Exporting report ${reportId}...`);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Overview Statistics */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Overview Statistics</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{overviewStats.totalClasses}</Text>
                        <Text style={styles.statLabel}>Total Classes</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{overviewStats.totalStudents}</Text>
                        <Text style={styles.statLabel}>Total Students</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{overviewStats.averageAttendance}%</Text>
                        <Text style={styles.statLabel}>Average Attendance</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{overviewStats.totalSessions}</Text>
                        <Text style={styles.statLabel}>Total Sessions</Text>
                    </View>
                </View>
            </Card>

            {/* Quick Reports */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Reports</Text>
                <View style={styles.quickReportsGrid}>
                    {quickReports.map((report) => (
                        <View key={report.id} style={styles.quickReportItem}>
                            <Text style={styles.quickReportTitle}>{report.title}</Text>
                            <Text style={styles.quickReportValue}>{report.value}</Text>
                            <Text
                                style={[
                                    styles.quickReportChange,
                                    report.isPositive ? styles.positiveChange : styles.negativeChange,
                                ]}
                            >
                                {report.change}
                            </Text>
                        </View>
                    ))}
                </View>
            </Card>

            {/* Recent Reports */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Reports</Text>
                {recentReports.map((report) => (
                    <TouchableOpacity
                        key={report.id}
                        style={styles.reportItem}
                        onPress={() => handleViewDetailedReport(report.id)}
                    >
                        <View style={styles.reportInfo}>
                            <Text style={styles.reportTitle}>{report.title}</Text>
                            <Text style={styles.reportDate}>{report.date}</Text>
                        </View>
                        <View style={styles.reportActions}>
                            <Text style={styles.reportAttendance}>{report.attendance}</Text>
                            <TouchableOpacity
                                style={styles.exportButton}
                                onPress={() => handleExportReport(report.id)}
                            >
                                <Text style={styles.exportButtonText}>Export</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </Card>

            {/* Generate Reports */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Generate Reports</Text>
                <View style={styles.generateReportsGrid}>
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={() => handleGenerateReport('daily')}
                    >
                        <Text style={styles.generateButtonText}>Daily Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={() => handleGenerateReport('weekly')}
                    >
                        <Text style={styles.generateButtonText}>Weekly Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={() => handleGenerateReport('monthly')}
                    >
                        <Text style={styles.generateButtonText}>Monthly Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={() => handleGenerateReport('custom')}
                    >
                        <Text style={styles.generateButtonText}>Custom Report</Text>
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: colors.card,
        marginBottom: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    quickReportsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickReportItem: {
        width: '48%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: colors.card,
        marginBottom: 16,
    },
    quickReportTitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    quickReportValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    quickReportChange: {
        fontSize: 14,
        fontWeight: '500',
    },
    positiveChange: {
        color: colors.success,
    },
    negativeChange: {
        color: colors.error,
    },
    reportItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    reportInfo: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    reportDate: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    reportActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reportAttendance: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary,
        marginRight: 16,
    },
    exportButton: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    exportButtonText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    generateReportsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    generateButton: {
        width: '48%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
        marginBottom: 16,
        alignItems: 'center',
    },
    generateButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
}); 