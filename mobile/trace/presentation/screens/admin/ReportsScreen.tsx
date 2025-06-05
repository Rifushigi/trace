import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    Alert,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/stores';
import { Card } from '@/presentation/components/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { useRefresh } from '@/presentation/hooks/useRefresh';
import { useErrorHandler } from '@/presentation/hooks/useErrorHandler';
import { useApi } from '@/presentation/hooks';
import { AttendanceMetrics } from '@/shared/types/attendance';
import { features } from '@/config/features';
import { getMockAttendanceMetrics } from '@/presentation/mocks/reportsMock';
import { colors } from '@/shared/constants/theme';




export const ReportsScreen = observer(() => {
    const { authStore } = useStores();
    const { handleError, isConnected } = useErrorHandler({
        showErrorAlert: true,
        onNetworkError: (error) => {
            Alert.alert('Network Error', 'Please check your internet connection');
        }
    });

    const [metrics, setMetrics] = useState<AttendanceMetrics | null>(null);

    const { execute: fetchMetrics, isLoading, error } = useApi<AttendanceMetrics, any>({
        store: authStore,
        action: (store) => async () => {
            // TODO: Replace with actual API call
            const mockData = getMockAttendanceMetrics();
            setMetrics(mockData);
            return mockData;
            
        },
    });

    const { refreshing, handleRefresh } = useRefresh({
        onRefresh: async () => {
            await handleError(async () => {
                await fetchMetrics();
            }, 'Failed to refresh reports');
        }
    });

    useEffect(() => {
        if (isConnected || features.useMockApi) {
            fetchMetrics();
        }
    }, [fetchMetrics, isConnected]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error || !metrics) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color={colors.primary} />
                <Text style={styles.errorText}>Failed to load reports</Text>
            </View>
        );
    }

    const screenWidth = Dimensions.get('window').width;

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
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            {/* Overview Cards */}
            <View style={styles.overviewContainer}>
                <Card style={styles.overviewCard}>
                    <MaterialIcons name="people" size={24} color={colors.primary} />
                    <Text style={styles.overviewValue}>{metrics.totalStudents}</Text>
                    <Text style={styles.overviewLabel}>Total Students</Text>
                </Card>
                <Card style={styles.overviewCard}>
                    <MaterialIcons name="school" size={24} color={colors.primary} />
                    <Text style={styles.overviewValue}>{metrics.totalLecturers}</Text>
                    <Text style={styles.overviewLabel}>Total Lecturers</Text>
                </Card>
                <Card style={styles.overviewCard}>
                    <MaterialIcons name="event-available" size={24} color={colors.primary} />
                    <Text style={styles.overviewValue}>{metrics.averageAttendanceRate}%</Text>
                    <Text style={styles.overviewLabel}>Avg. Attendance</Text>
                </Card>
                <Card style={styles.overviewCard}>
                    <MaterialIcons name="class" size={24} color={colors.primary} />
                    <Text style={styles.overviewValue}>{metrics.totalClasses}</Text>
                    <Text style={styles.overviewLabel}>Total Classes</Text>
                </Card>
            </View>

            {/* Attendance Trend Chart */}
            <Card style={styles.chartCard}>
                <Text style={styles.chartTitle}>Attendance Trend (Last 7 Days)</Text>
                <LineChart
                    data={{
                        labels: metrics.recentAttendanceRates.map((item: { date: Date }) => 
                            format(item.date, 'MM/dd')
                        ),
                        datasets: [{
                            data: metrics.recentAttendanceRates.map((item: { rate: number }) => item.rate)
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
                {metrics.attendanceByProgram.map((item: { program: string; attendanceRate: number; totalStudents: number }) => (
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

            {/* Level-wise Attendance */}
            <Card style={styles.statsCard}>
                <Text style={styles.chartTitle}>Attendance by Level</Text>
                {metrics.attendanceByLevel.map((item: { level: string; attendanceRate: number; totalStudents: number }) => (
                    <View key={item.level} style={styles.statRow}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statLabel}>Level {item.level}</Text>
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
        backgroundColor: colors.background,
        padding: 16,
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
        backgroundColor: colors.light,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    statBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: colors.primary,
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