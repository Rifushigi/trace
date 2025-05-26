import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { colors } from '../../../shared/constants/theme';

export const ClassDetailsScreen = observer(() => {
    const { classId } = useLocalSearchParams<{ classId: string }>();
    const { authStore } = useStores();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartSession = () => {
        router.push({
            pathname: '/session-control',
            params: { classId }
        });
    };

    const handleViewAttendance = () => {
        router.push({
            pathname: '/attendance-management',
            params: { classId }
        });
    };

    const handleEditClass = () => {
        router.push({
            pathname: '/edit-class',
            params: { classId }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Class Details</Text>
            <Text style={styles.classId}>Class ID: {classId}</Text>

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Course Information</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Course Name:</Text>
                    <Text style={styles.infoValue}>Data Structures</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Schedule:</Text>
                    <Text style={styles.infoValue}>Mon, Wed, Fri 11:00 AM - 12:30 PM</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Room:</Text>
                    <Text style={styles.infoValue}>Room 101</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>30</Text>
                    <Text style={styles.statLabel}>Total Students</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>85%</Text>
                    <Text style={styles.statLabel}>Average Attendance</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleStartSession}
                >
                    <Text style={styles.buttonText}>Start Session</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleViewAttendance}
                >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                        View Attendance
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleEditClass}
                >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                        Edit Class
                    </Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    classId: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 16,
        textAlign: 'center',
    },
    infoCard: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        backgroundColor: colors.card,
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
    actionsContainer: {
        flexDirection: 'row',
        margin: 16,
        marginTop: 0,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#FFFFFF',
    },
    secondaryButtonText: {
        color: colors.text,
    },
}); 