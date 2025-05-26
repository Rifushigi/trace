import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../presentation/screens/student/DashboardScreen';
import { AttendanceStatusScreen } from '../presentation/screens/student/AttendanceStatusScreen';
import { ScheduleScreen } from '../presentation/screens/student/ScheduleScreen';
import { ClassDetailsScreen } from '../presentation/screens/student/ClassDetailsScreen';
import { AttendanceHistoryScreen } from '../presentation/screens/student/AttendanceHistoryScreen';
import { StudentStackParamList } from './types';

const Stack = createNativeStackNavigator<StudentStackParamList>();

export const StudentNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    title: 'Student Dashboard',
                }}
            />
            <Stack.Screen
                name="AttendanceStatus"
                component={AttendanceStatusScreen}
                options={{
                    title: 'Attendance Status',
                }}
            />
            <Stack.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{
                    title: 'Schedule',
                }}
            />
            <Stack.Screen
                name="ClassDetails"
                component={ClassDetailsScreen}
                options={{
                    title: 'Class Details',
                }}
            />
            <Stack.Screen
                name="AttendanceHistory"
                component={AttendanceHistoryScreen}
                options={{
                    title: 'Attendance History',
                }}
            />
            {/* Add other student screens here */}
        </Stack.Navigator>
    );
}; 