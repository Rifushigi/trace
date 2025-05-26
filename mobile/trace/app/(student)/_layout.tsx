import { Stack } from 'expo-router';

export default function StudentLayout() {
    return (
        <Stack>
            <Stack.Screen 
                name="dashboard" 
                options={{ 
                    title: 'Dashboard',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="attendance-status" 
                options={{ 
                    title: 'Attendance Status',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="schedule" 
                options={{ 
                    title: 'Schedule',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="class-details" 
                options={{ 
                    title: 'Class Details',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="attendance-history" 
                options={{ 
                    title: 'Attendance History',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="device-setup" 
                options={{ 
                    title: 'Device Setup',
                    headerShown: true 
                }} 
            />
        </Stack>
    );
} 