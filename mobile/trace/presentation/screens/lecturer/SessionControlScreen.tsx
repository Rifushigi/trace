import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { router } from 'expo-router';

export const SessionControlScreen = observer(({ route }: { route: { params: { classId: string } } }) => {
    const { authStore } = useStores();
    const user = authStore.state.user;
    const { classId } = route.params as { classId: string };

    // Mock data - replace with actual data from your backend
    const [sessionData, setSessionData] = useState({
        course: 'Data Structures',
        startTime: '11:00 AM',
        duration: '1h 30m',
        totalStudents: 50,
        presentStudents: 45,
        absentStudents: 3,
        lateStudents: 2,
    });

    const [students, setStudents] = useState([
        { id: '1', name: 'John Doe', status: 'present', time: '11:00 AM' },
        { id: '2', name: 'Jane Smith', status: 'present', time: '11:00 AM' },
        { id: '3', name: 'Bob Johnson', status: 'late', time: '11:15 AM' },
        { id: '4', name: 'Alice Brown', status: 'absent', time: '-' },
        { id: '5', name: 'Charlie Wilson', status: 'present', time: '11:00 AM' },
    ]);

    const [sessionSettings, setSessionSettings] = useState({
        autoMarkAbsent: true,
        allowLateEntry: true,
        requireLocation: true,
        requireFaceRecognition: true,
    });

    useEffect(() => {
        // TODO: Fetch session data and students list
        // TODO: Set up real-time updates
    }, [classId]);

    const handleEndSession = () => {
        Alert.alert(
            'End Session',
            'Are you sure you want to end this session?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'End Session',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Implement end session logic
                        router.back();
                    },
                },
            ],
        );
    };

    const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === studentId
                    ? { ...student, status, time: status === 'absent' ? '-' : new Date().toLocaleTimeString() }
                    : student
            )
        );
        // TODO: Update attendance in backend
    };

    const handleToggleSetting = (setting: keyof typeof sessionSettings) => {
        setSessionSettings(prev => ({
            ...prev,
            [setting]: !prev[setting],
        }));
        // TODO: Update settings in backend
    };

    return (
        <ScrollView style={styles.container}>
            {/* Session Overview */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Session Overview</Text>
                <View style={styles.overviewGrid}>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Course</Text>
                        <Text style={styles.overviewValue}>{sessionData.course}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Start Time</Text>
                        <Text style={styles.overviewValue}>{sessionData.startTime}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Duration</Text>
                        <Text style={styles.overviewValue}>{sessionData.duration}</Text>
                    </View>
                    <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Total Students</Text>
                        <Text style={styles.overviewValue}>{sessionData.totalStudents}</Text>
                    </View>
                </View>
            </Card>

            {/* Attendance Statistics */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Attendance Statistics</Text>
                <View style={styles.statsGrid}>
                    <View style={[styles.statItem, styles.presentStat]}>
                        <Text style={styles.statValue}>{sessionData.presentStudents}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={[styles.statItem, styles.absentStat]}>
                        <Text style={styles.statValue}>{sessionData.absentStudents}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <View style={[styles.statItem, styles.lateStat]}>
                        <Text style={styles.statValue}>{sessionData.lateStudents}</Text>
                        <Text style={styles.statLabel}>Late</Text>
                    </View>
                </View>
            </Card>

            {/* Student List */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Student List</Text>
                {students.map((student) => (
                    <View key={student.id} style={styles.studentItem}>
                        <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>{student.name}</Text>
                            <Text style={styles.studentTime}>{student.time}</Text>
                        </View>
                        <View style={styles.studentActions}>
                            <TouchableOpacity
                                style={[styles.statusButton, student.status === 'present' && styles.activeStatus]}
                                onPress={() => handleMarkAttendance(student.id, 'present')}
                            >
                                <Text style={[styles.statusButtonText, student.status === 'present' && styles.activeStatusText]}>
                                    Present
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.statusButton, student.status === 'late' && styles.activeStatus]}
                                onPress={() => handleMarkAttendance(student.id, 'late')}
                            >
                                <Text style={[styles.statusButtonText, student.status === 'late' && styles.activeStatusText]}>
                                    Late
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.statusButton, student.status === 'absent' && styles.activeStatus]}
                                onPress={() => handleMarkAttendance(student.id, 'absent')}
                            >
                                <Text style={[styles.statusButtonText, student.status === 'absent' && styles.activeStatusText]}>
                                    Absent
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </Card>

            {/* Session Settings */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Session Settings</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Auto-mark Absent</Text>
                    <TouchableOpacity
                        style={[styles.toggle, sessionSettings.autoMarkAbsent && styles.toggleActive]}
                        onPress={() => handleToggleSetting('autoMarkAbsent')}
                    >
                        <View style={[styles.toggleHandle, sessionSettings.autoMarkAbsent && styles.toggleHandleActive]} />
                    </TouchableOpacity>
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Allow Late Entry</Text>
                    <TouchableOpacity
                        style={[styles.toggle, sessionSettings.allowLateEntry && styles.toggleActive]}
                        onPress={() => handleToggleSetting('allowLateEntry')}
                    >
                        <View style={[styles.toggleHandle, sessionSettings.allowLateEntry && styles.toggleHandleActive]} />
                    </TouchableOpacity>
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Require Location</Text>
                    <TouchableOpacity
                        style={[styles.toggle, sessionSettings.requireLocation && styles.toggleActive]}
                        onPress={() => handleToggleSetting('requireLocation')}
                    >
                        <View style={[styles.toggleHandle, sessionSettings.requireLocation && styles.toggleHandleActive]} />
                    </TouchableOpacity>
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Require Face Recognition</Text>
                    <TouchableOpacity
                        style={[styles.toggle, sessionSettings.requireFaceRecognition && styles.toggleActive]}
                        onPress={() => handleToggleSetting('requireFaceRecognition')}
                    >
                        <View style={[styles.toggleHandle, sessionSettings.requireFaceRecognition && styles.toggleHandleActive]} />
                    </TouchableOpacity>
                </View>
            </Card>

            {/* End Session Button */}
            <TouchableOpacity
                style={styles.endSessionButton}
                onPress={handleEndSession}
            >
                <Text style={styles.endSessionButtonText}>End Session</Text>
            </TouchableOpacity>
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
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        color: colors.success,
    },
    absentStat: {
        backgroundColor: colors.error + '20',
        color: colors.error,
    },
    lateStat: {
        backgroundColor: colors.warning + '20',
        color: colors.warning,
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
    studentItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    studentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    studentTime: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    studentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusButton: {
        flex: 1,
        padding: 8,
        borderRadius: 6,
        marginHorizontal: 4,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeStatus: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    statusButtonText: {
        fontSize: 12,
        textAlign: 'center',
        color: colors.text,
    },
    activeStatusText: {
        color: '#FFFFFF',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingLabel: {
        fontSize: 16,
        color: colors.text,
    },
    toggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 2,
    },
    toggleActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    toggleHandle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.textSecondary,
    },
    toggleHandleActive: {
        backgroundColor: '#FFFFFF',
        transform: [{ translateX: 22 }],
    },
    endSessionButton: {
        margin: 16,
        padding: 16,
        backgroundColor: colors.error,
        borderRadius: 8,
        alignItems: 'center',
    },
    endSessionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 