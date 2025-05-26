import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { PasswordResetRequest } from '../../../domain/entities/Auth';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = observer(() => {
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const { authStore } = useStores();
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        try {
            const request: PasswordResetRequest = { email };
            await authStore.requestPasswordReset(request);
            Alert.alert(
                'Success',
                'Password reset instructions have been sent to your email',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to send reset instructions'
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email address and we&apos;ll send you instructions to reset your password
                </Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleResetPassword}
                    disabled={authStore.authState.isLoading}
                >
                    {authStore.authState.isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Send Reset Instructions</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.linkText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#666',
        fontSize: 16,
        marginTop: 8,
    },
    form: {
        flex: 1,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linkButton: {
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: {
        color: '#007AFF',
        fontSize: 16,
    },
}); 