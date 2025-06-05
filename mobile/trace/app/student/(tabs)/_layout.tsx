import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/shared/constants/theme';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
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
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
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
                    name="classes"
                    options={{ 
                        title: 'Classes',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="school" size={size} color={color} />
                        ),
                    }} 
                />
            <Tabs.Screen
                name="attendance-status"
                options={{ 
                    title: 'Attendance',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="check-circle" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen
                name="attendance-history"
                options={{ 
                    title: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="history" size={size} color={color} />
                    ),
                }} 
            />
        </Tabs>
    );
} 