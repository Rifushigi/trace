import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Input } from '../../components/Input';
import { colors } from '../../../shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useForm } from '../../hooks/useForm';

const { height } = Dimensions.get('window');
const HORIZONTAL_PADDING = 24;

interface FormValues {
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    [key: string]: string;
}

export const ResetPasswordScreen = observer(() => {
    const { token } = useLocalSearchParams<{ token: string }>();
    const { confirmPasswordReset, isConfirmingReset } = useAuth();
    const { handleError } = useErrorHandler({
        showErrorAlert: true
    });
    const { isConnected } = useNetworkStatus();

    const { formState, setFieldValue, handleSubmit, isSubmitting } = useForm<FormValues, FormErrors>({
        store: {} as FormErrors,
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationRules: {
            password: [
                { validate: (value: string): boolean => !!value, message: 'Password is required' },
                { validate: (value: string): boolean => value.length >= 8, message: 'Password must be at least 8 characters' },
                { validate: (value: string): boolean => /[A-Z]/.test(value), message: 'Password must contain at least one uppercase letter' },
                { validate: (value: string): boolean => /[0-9]/.test(value), message: 'Password must contain at least one number' }
            ],
            confirmPassword: [
                { validate: (value: string): boolean => !!value, message: 'Please confirm your password' },
                { validate: (value: string): boolean => value === formState.password?.value, message: 'Passwords do not match' }
            ]
        },
        action: async (_, values) => {
            await handleError(async () => {
                await confirmPasswordReset({ token, newPassword: values.password });
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
            });
        }
    });

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
                                value={formState.password?.value}
                                onChangeText={(value) => setFieldValue('password', value)}
                                secureTextEntry
                                inputContainerStyle={styles.inputField}
                                error={formState.password?.error}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Confirm New Password"
                                value={formState.confirmPassword?.value}
                                onChangeText={(value) => setFieldValue('confirmPassword', value)}
                                secureTextEntry
                                inputContainerStyle={styles.inputField}
                                error={formState.confirmPassword?.error}
                            />
                        </View>

                        <View style={styles.passwordRequirements}>
                            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                            <View style={styles.requirementItem}>
                                <MaterialIcons 
                                    name={formState.password?.value?.length >= 8 ? "check-circle" : "radio-button-unchecked"} 
                                    size={16} 
                                    color={formState.password?.value?.length >= 8 ? colors.success : colors.textSecondary} 
                                />
                                <Text style={styles.requirementText}>At least 8 characters</Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <MaterialIcons 
                                    name={/[A-Z]/.test(formState.password?.value || '') ? "check-circle" : "radio-button-unchecked"} 
                                    size={16} 
                                    color={/[A-Z]/.test(formState.password?.value || '') ? colors.success : colors.textSecondary} 
                                />
                                <Text style={styles.requirementText}>One uppercase letter</Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <MaterialIcons 
                                    name={/[0-9]/.test(formState.password?.value || '') ? "check-circle" : "radio-button-unchecked"} 
                                    size={16} 
                                    color={/[0-9]/.test(formState.password?.value || '') ? colors.success : colors.textSecondary} 
                                />
                                <Text style={styles.requirementText}>One number</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.submitButton, (!isConnected || isSubmitting) && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                            disabled={!isConnected || isSubmitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Resetting...' : 'Reset Password'}
                            </Text>
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
    buttonDisabled: {
        opacity: 0.5,
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