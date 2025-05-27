import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../shared/constants/theme';

export default function StudentLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopColor: colors.border,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="dashboard" 
                options={{ 
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="dashboard" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen
                name="schedule" 
                options={{ 
                    title: 'Schedule',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="calendar-today" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen
                name="attendance"
                options={{ 
                    title: 'Attendance',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="check-circle" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen
                name="profile"
                options={{ 
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }} 
            />
        </Tabs>
    );
} 