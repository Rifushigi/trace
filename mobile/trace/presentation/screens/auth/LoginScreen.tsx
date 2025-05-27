import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Input } from '../../../components/common/Input';
import { colors } from '../../../shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const HORIZONTAL_PADDING = 24;

export const LoginScreen = observer(() => {
    const { authStore } = useStores();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await authStore.login({ email, password });
            // Navigation will be handled by the root layout based on user role
        } catch (error) {
            Alert.alert('Error', 'Invalid email or password');
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="email" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                inputContainerStyle={styles.inputField}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                inputContainerStyle={styles.inputField}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push('/forgot-password')}
                            style={styles.forgotPassword}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/register/role')}
                            style={styles.registerLink}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.registerLinkText}>Don&apos;t have an account?</Text>
                            <Text style={styles.registerLinkTextBold}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 32,
        paddingTop: 48,
    },
    header: {
        alignItems: 'center',
        paddingTop: height * 0.12,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '400',
    },
    formContainer: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    iconWrapper: {
        paddingHorizontal: 16,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputField: {
        flex: 1,
        height: 52,
        fontSize: 16,
        color: '#1F2937',
        paddingVertical: 0,
        backgroundColor: '#FFFFFF',
    },
    forgotPassword: {
        alignItems: 'flex-end',
        paddingVertical: 8,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        paddingBottom: height * 0.04,
        paddingTop: 20,
    },
    loginButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    registerLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 4,
        marginTop: 12,
    },
    registerLinkText: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '400',
    },
    registerLinkTextBold: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600',
    },
}); 