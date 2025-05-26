import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { WelcomeScreen } from '../presentation/screens/auth/WelcomeScreen';
import { LoginScreen } from '../presentation/screens/auth/LoginScreen';
import { ForgotPasswordScreen } from '../presentation/screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../presentation/screens/auth/ResetPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: true,
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
                name="Welcome"
                component={WelcomeScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    title: 'Login',
                }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                    title: 'Forgot Password',
                }}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{
                    title: 'Reset Password',
                }}
            />
        </Stack.Navigator>
    );
}; 