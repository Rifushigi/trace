import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';

interface AttendanceMetrics {
    totalStudents: number;
    totalLecturers: number;
    averageAttendanceRate: number;
    totalClasses: number;
    attendanceByProgram: {
        program: string;
        attendanceRate: number;
        totalStudents: number;
    }[];
    attendanceByLevel: {
        level: string;
        attendanceRate: number;
        totalStudents: number;
    }[];
    recentAttendanceRates: {
        date: Date;
        rate: number;
    }[];
}

const BLUE = {
    primary: '#1976D2',
    light: '#E3F2FD',
    dark: '#1565C0',
    text: '#2196F3',
    background: '#F5F9FF',
};

export const ReportsScreen = observer(() => {
    const { authStore } = useStores();
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [metrics, setMetrics] = useState<AttendanceMetrics | null>(null);
    const screenWidth = Dimensions.get('window').width;

    const fetchMetrics = useCallback(async () => {
        try {
            // TODO: Replace with actual API call
            // For now, using mock data
            const mockMetrics: AttendanceMetrics = {
                totalStudents: 450,
                totalLecturers: 32,
                averageAttendanceRate: 88.5,
                totalClasses: 128,
                attendanceByProgram: [
                    { program: 'Computer Science', attendanceRate: 92.3, totalStudents: 120 },
                    { program: 'Electrical Engineering', attendanceRate: 87.8, totalStudents: 95 },
                    { program: 'Mechanical Engineering', attendanceRate: 85.4, totalStudents: 88 },
                    { program: 'Civil Engineering', attendanceRate: 89.1, totalStudents: 78 },
                    { program: 'Chemical Engineering', attendanceRate: 86.9, totalStudents: 69 },
                ],
                attendanceByLevel: [
                    { level: '100', attendanceRate: 84.2, totalStudents: 150 },
                    { level: '200', attendanceRate: 87.5, totalStudents: 125 },
                    { level: '300', attendanceRate: 89.8, totalStudents: 100 },
                    { level: '400', attendanceRate: 92.4, totalStudents: 75 },
                ],
                recentAttendanceRates: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
                    rate: 80 + Math.random() * 15,
                })),
            };
            setMetrics(mockMetrics);
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchMetrics();
            setIsLoading(false);
        };
        loadData();
    }, [fetchMetrics]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchMetrics();
        setIsRefreshing(false);
    }, [fetchMetrics]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BLUE.primary} />
            </View>
        );
    }

    if (!metrics) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color={BLUE.primary} />
                <Text style={styles.errorText}>Failed to load reports</Text>
            </View>
        );
    }

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    };

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 16 }}
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        >
            {/* Overview Cards */}
            <View style={styles.overviewContainer}>
                <Card style={styles.overviewCard}>
                    <MaterialIcons name="people" size={24} color={BLUE.primary} />
                    <Text style={styles.overviewValue}>{metrics.totalStudents}</Text>
                    <Text style={styles.overviewLabel}>Total Students</Text>
                </Card>
                <Card style={styles.overviewCard}>
                    <MaterialIcons name="school" size={24} color={BLUE.primary} />
                    <Text style={styles.overviewValue}>{metrics.totalLecturers}</Text>
                    <Text style={styles.overviewLabel}>Total Lecturers</Text>
                </Card>
                <Card style={styles.overviewCard}>
                    <MaterialIcons name="event-available" size={24} color={BLUE.primary} />
                    <Text style={styles.overviewValue}>{metrics.averageAttendanceRate}%</Text>
                    <Text style={styles.overviewLabel}>Avg. Attendance</Text>
                </Card>
                <Card style={styles.overviewCard}>
                    <MaterialIcons name="class" size={24} color={BLUE.primary} />
                    <Text style={styles.overviewValue}>{metrics.totalClasses}</Text>
                    <Text style={styles.overviewLabel}>Total Classes</Text>
                </Card>
            </View>

            {/* Attendance Trend Chart */}
            <Card style={styles.chartCard}>
                <Text style={styles.chartTitle}>Attendance Trend (Last 7 Days)</Text>
                <LineChart
                    data={{
                        labels: metrics.recentAttendanceRates.map(item => 
                            format(item.date, 'MM/dd')
                        ),
                        datasets: [{
                            data: metrics.recentAttendanceRates.map(item => item.rate)
                        }]
                    }}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </Card>

            {/* Program-wise Attendance */}
            <Card style={styles.statsCard}>
                <Text style={styles.chartTitle}>Attendance by Program</Text>
                {metrics.attendanceByProgram.map(item => (
                    <View key={item.program} style={styles.statRow}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statLabel}>{item.program}</Text>
                            <Text style={styles.statSubtext}>
                                {item.totalStudents} students
                            </Text>
                        </View>
                        <View style={styles.statBarContainer}>
                            <View 
                                style={[
                                    styles.statBar, 
                                    { width: `${item.attendanceRate}%` }
                                ]} 
                            />
                            <Text style={styles.statValue}>
                                {item.attendanceRate.toFixed(1)}%
                            </Text>
                        </View>
                    </View>
                ))}
            </Card>

            {/* Level-wise Stats */}
            <Card style={styles.statsCard}>
                <Text style={styles.chartTitle}>Attendance by Level</Text>
                {metrics.attendanceByLevel.map(item => (
                    <View key={item.level} style={styles.statRow}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statLabel}>{item.level} Level</Text>
                            <Text style={styles.statSubtext}>
                                {item.totalStudents} students
                            </Text>
                        </View>
                        <View style={styles.statBarContainer}>
                            <View 
                                style={[
                                    styles.statBar, 
                                    { width: `${item.attendanceRate}%` }
                                ]} 
                            />
                            <Text style={styles.statValue}>
                                {item.attendanceRate.toFixed(1)}%
                            </Text>
                        </View>
                    </View>
                ))}
            </Card>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BLUE.background,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BLUE.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BLUE.background,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666666',
    },
    overviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 16,
    },
    overviewCard: {
        flex: 1,
        minWidth: '45%',
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    overviewValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    overviewLabel: {
        fontSize: 14,
        color: '#666666',
    },
    chartCard: {
        padding: 16,
        marginBottom: 16,
    },
    statsCard: {
        padding: 16,
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    chart: {
        borderRadius: 8,
        marginVertical: 8,
    },
    statRow: {
        marginBottom: 16,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    statSubtext: {
        fontSize: 12,
        color: '#666666',
    },
    statBarContainer: {
        height: 24,
        backgroundColor: BLUE.light,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    statBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: BLUE.primary,
        borderRadius: 12,
    },
    statValue: {
        position: 'absolute',
        right: 8,
        top: 2,
        fontSize: 12,
        fontWeight: '600',
        color: '#333333',
    },
}); 