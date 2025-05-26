import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../presentation/screens/settings/SettingsScreen';

export type SettingsStackParamList = {
    Settings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#000',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                }}
            />
        </Stack.Navigator>
    );
}; 