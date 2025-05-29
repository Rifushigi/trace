import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { router } from 'expo-router';

// Mock data for demonstration
const mockSchedule = [
    {
        id: '1',
        courseName: 'Introduction to Computer Science',
        lecturer: 'Dr. John Smith',
        room: 'Room 101',
        startTime: '09:00',
        endTime: '10:30',
        day: 'Monday',
    },
    {
        id: '2',
        courseName: 'Data Structures',
        lecturer: 'Prof. Jane Doe',
        room: 'Room 202',
        startTime: '11:00',
        endTime: '12:30',
        day: 'Monday',
    },
    // Add more mock data as needed
];

export const ScheduleScreen = observer(() => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState('Monday');

    // Generate days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Filter schedule for selected day
    const filteredSchedule = mockSchedule.filter(item => item.day === selectedDay);

    return (
        <ScrollView style={styles.container}>
            {/* Week Calendar */}
            <Card style={styles.calendarSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {daysOfWeek.map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayButton,
                                selectedDay === day && styles.selectedDayButton,
                            ]}
                            onPress={() => setSelectedDay(day)}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    selectedDay === day && styles.selectedDayText,
                                ]}
                            >
                                {day.slice(0, 3)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Card>

            {/* Schedule List */}
            <View style={styles.scheduleSection}>
                <Text style={styles.sectionTitle}>{selectedDay}&apos;s Schedule</Text>
                {filteredSchedule.length > 0 ? (
                    filteredSchedule.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => router.push({
                                pathname: '/student/class-details',
                                params: { classId: item.id }
                            })}
                        >
                            <Card style={styles.scheduleItem}>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeText}>{item.startTime}</Text>
                                    <Text style={styles.timeText}>{item.endTime}</Text>
                                </View>
                                <View style={styles.classInfo}>
                                    <Text style={styles.courseName}>{item.courseName}</Text>
                                    <Text style={styles.lecturerName}>Lecturer: {item.lecturer}</Text>
                                    <Text style={styles.roomText}>Room: {item.room}</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No classes scheduled for {selectedDay}</Text>
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
    calendarSection: {
        margin: 16,
        padding: 16,
    },
    dayButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectedDayButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    dayText: {
        fontSize: 16,
        color: colors.text,
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: '600',
    },
    scheduleSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    scheduleItem: {
        flexDirection: 'row',
        marginBottom: 12,
        padding: 16,
    },
    timeContainer: {
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: colors.border,
        paddingRight: 16,
    },
    timeText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    classInfo: {
        flex: 1,
    },
    courseName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    lecturerName: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    roomText: {
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