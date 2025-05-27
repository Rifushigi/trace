import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Input } from '../../../components/common/Input';
import { colors } from '../../../shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const HORIZONTAL_PADDING = 24;

export const ResetPasswordScreen = observer(() => {
    const { token } = useLocalSearchParams<{ token: string }>();
    const { authStore } = useStores();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            await authStore.confirmPasswordReset({ token, newPassword: password });
            Alert.alert(
                'Success',
                'Your password has been reset successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/login'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to reset password. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.safeArea}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>New Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your new password below
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="New Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                inputContainerStyle={styles.inputField}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                inputContainerStyle={styles.inputField}
                            />
                        </View>

                        <View style={styles.passwordRequirements}>
                            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                            <View style={styles.requirementItem}>
                                <MaterialIcons 
                                    name={password.length >= 8 ? "check-circle" : "radio-button-unchecked"} 
                                    size={16} 
                                    color={password.length >= 8 ? colors.success : colors.textSecondary} 
                                />
                                <Text style={styles.requirementText}>At least 8 characters</Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <MaterialIcons 
                                    name={/[A-Z]/.test(password) ? "check-circle" : "radio-button-unchecked"} 
                                    size={16} 
                                    color={/[A-Z]/.test(password) ? colors.success : colors.textSecondary} 
                                />
                                <Text style={styles.requirementText}>One uppercase letter</Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <MaterialIcons 
                                    name={/[0-9]/.test(password) ? "check-circle" : "radio-button-unchecked"} 
                                    size={16} 
                                    color={/[0-9]/.test(password) ? colors.success : colors.textSecondary} 
                                />
                                <Text style={styles.requirementText}>One number</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.submitButtonText}>Reset Password</Text>
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
        backgroundColor: '#FAFAFA',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 32,
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
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '400',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
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
    passwordRequirements: {
        marginTop: 8,
        paddingHorizontal: 4,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    requirementText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#6B7280',
    },
    footer: {
        paddingBottom: height * 0.04,
        paddingTop: 20,
    },
    submitButton: {
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
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    backLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 12,
    },
    backIcon: {
        marginRight: 8,
    },
    backLinkText: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600',
    },
}); 