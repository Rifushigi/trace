import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStores } from '../stores';
import { MainStackParamList } from './types';
import { StudentNavigator } from './StudentNavigator';
import { HomeScreen } from '../presentation/screens/home/HomeScreen';
import { ProfileScreen } from '../presentation/screens/profile/ProfileScreen';
import { EditProfileScreen } from '../presentation/screens/profile/EditProfileScreen';
import { SettingsScreen } from '../presentation/screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
    const { authStore } = useStores();
    const user = authStore.authState.user;

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
            {user?.role === 'student' ? (
                <Stack.Screen
                    name="Student"
                    component={StudentNavigator}
                    options={{ headerShown: false }}
                />
            ) : (
                <>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: 'Home' }}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{ title: 'Profile' }}
                    />
                    <Stack.Screen
                        name="EditProfile"
                        component={EditProfileScreen}
                        options={{ title: 'Edit Profile' }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{ title: 'Settings' }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}; 