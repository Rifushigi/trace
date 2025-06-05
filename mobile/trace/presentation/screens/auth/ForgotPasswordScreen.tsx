import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
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
    email: string;
}

interface FormErrors {
    [key: string]: string;
}

export const ForgotPasswordScreen = observer(() => {
    const { requestPasswordReset, isRequestingReset } = useAuth();
    const { handleError } = useErrorHandler({
        showErrorAlert: true
    });
    const { isConnected } = useNetworkStatus();

    const { formState, setFieldValue, handleSubmit, isSubmitting } = useForm<FormValues, FormErrors>({
        store: {} as FormErrors,
        initialValues: {
            email: ''
        },
        validationRules: {
            email: [
                { validate: (value: string): boolean => !!value, message: 'Email is required' },
                { validate: (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Invalid email format' }
            ]
        },
        action: async (_, values) => {
            await handleError(async () => {
                await requestPasswordReset(values);
                Alert.alert(
                    'Success',
                    'Password reset instructions have been sent to your email',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back(),
                        },
                    ]
                );
            });
        }
    });

    return (
        <KeyboardAvoidingView 
            style={styles.container}
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
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your email address and we&apos;ll send you instructions to reset your password
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="email" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Email"
                                value={formState.email?.value}
                                onChangeText={(value) => setFieldValue('email', value)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                inputContainerStyle={styles.inputField}
                                error={formState.email?.error}
                            />
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
                                {isSubmitting ? 'Sending...' : 'Send Instructions'}
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