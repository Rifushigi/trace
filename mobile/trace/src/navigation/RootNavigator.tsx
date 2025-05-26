import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useStores } from '../stores';
import { observer } from 'mobx-react-lite';

const Stack = createNativeStackNavigator();

export const RootNavigator = observer(() => {
    const { authStore } = useStores();

    useEffect(() => {
        // No need to check for checkAuthState as it doesn't exist
    }, [authStore]);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {authStore.authState.isAuthenticated ? (
                    <Stack.Screen name="Main" component={MainNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}); 