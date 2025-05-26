import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Input } from '../../../components/common/Input';
import { colors } from '../../../shared/constants/theme';

export const ForgotPasswordScreen = observer(() => {
    const { authStore } = useStores();
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try {
            await authStore.requestPasswordReset({ email });
            Alert.alert(
                'Success',
                'Password reset instructions have been sent to your email',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/login'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to send reset instructions. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
                Enter your email address and we&apos;ll send you instructions to reset your password.
            </Text>
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
            >
                <Text style={styles.buttonText}>Send Reset Instructions</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.back()}
            >
                <Text style={styles.linkText}>Back to Login</Text>
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
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