import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { colors } from '../../../shared/constants/theme';

export const AttendanceManagementScreen = observer(() => {
    const { classId } = useLocalSearchParams<{ classId: string }>();
    const { authStore } = useStores();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleViewSessionDetails = (sessionId: string) => {
        router.push({
            pathname: '/session-details',
            params: { sessionId }
        });
    };

    const handleExportAttendance = () => {
        // Export attendance logic here
        Alert.alert('Success', 'Attendance data exported successfully');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Attendance Management</Text>
            <Text style={styles.classId}>Class ID: {classId}</Text>

            <View style={styles.dateSelector}>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                        // Date selection logic here
                    }}
                >
                    <Text style={styles.dateButtonText}>
                        {selectedDate.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>85%</Text>
                    <Text style={styles.statLabel}>Attendance Rate</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>15</Text>
                    <Text style={styles.statLabel}>Total Sessions</Text>
                </View>
            </View>

            <View style={styles.sessionsList}>
                <Text style={styles.sectionTitle}>Recent Sessions</Text>
                {/* Mock session data */}
                {[1, 2, 3].map((session) => (
                    <TouchableOpacity
                        key={session}
                        style={styles.sessionCard}
                        onPress={() => handleViewSessionDetails(session.toString())}
                    >
                        <View style={styles.sessionInfo}>
                            <Text style={styles.sessionDate}>
                                Session {session} - {new Date().toLocaleDateString()}
                            </Text>
                            <Text style={styles.sessionStats}>
                                25/30 students present
                            </Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={styles.exportButton}
                onPress={handleExportAttendance}
            >
                <Text style={styles.exportButtonText}>Export Attendance Data</Text>
            </TouchableOpacity>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
        marginTop: 16,
        marginLeft: 16,
    },
    classId: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 16,
        marginLeft: 16,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginLeft: 16,
    },
    dateButton: {
        padding: 12,
        backgroundColor: colors.primary,
        borderRadius: 8,
        marginRight: 8,
    },
    dateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginLeft: 16,
        marginRight: 16,
    },
    statCard: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.card,
        borderRadius: 8,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    sessionsList: {
        marginBottom: 16,
        marginLeft: 16,
        marginRight: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    sessionCard: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionInfo: {
        flexDirection: 'column',
    },
    sessionDate: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    sessionStats: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    arrow: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    exportButton: {
        margin: 16,
        padding: 16,
        backgroundColor: colors.primary,
        borderRadius: 8,
        alignItems: 'center',
    },
    exportButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 