import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Input } from '../../../components/common/Input';
import { colors } from '../../../shared/constants/theme';

export const RegisterScreen = observer(() => {
    const { authStore } = useStores();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            await authStore.register({
                firstName,
                lastName,
                email,
                password,
                role: 'student', // Default role for registration
            });
            // Navigation will be handled by the root layout based on user role
        } catch (error) {
            Alert.alert('Error', 'Registration failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Input
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <Input
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Input
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push('/login')}
            >
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linkText: {
        color: colors.primary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
});