import { Stack } from 'expo-router';

export default function LecturerLayout() {
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
                name="class-management" 
                options={{ 
                    title: 'Class Management',
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
                name="session-control" 
                options={{ 
                    title: 'Session Control',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="attendance-management" 
                options={{ 
                    title: 'Attendance Management',
                    headerShown: true 
                }} 
            />
        </Stack>
    );
} 