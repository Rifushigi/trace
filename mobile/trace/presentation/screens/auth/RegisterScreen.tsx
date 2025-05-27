import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Dimensions, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Input } from '../../../components/common/Input';
import { colors } from '../../../shared/constants/theme';
import { RegisterData } from '../../../domain/entities/Auth';
import { UserRole } from './RoleSelectionScreen';
import { MaterialIcons } from '@expo/vector-icons';

type Step = 'basic' | 'role-specific' | 'password';

interface FormData extends RegisterData {
    confirmPassword: string;
}

const { width, height } = Dimensions.get('window');
const HORIZONTAL_PADDING = 24;

export const RegisterScreen = observer(() => {
    const { role } = useLocalSearchParams<{ role: UserRole }>();
    const { authStore } = useStores();
    const [currentStep, setCurrentStep] = useState<Step>('basic');
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: role as UserRole,
        matricNo: '',
        program: '',
        level: '',
        staffId: '',
        college: '',
    });

    const updateForm = (key: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        switch (currentStep) {
            case 'basic':
                if (!formData.firstName || !formData.lastName || !formData.email) {
                    Alert.alert('Error', 'Please fill in all fields');
                    return;
                }
                setCurrentStep('role-specific');
                break;
            case 'role-specific':
                if (formData.role === 'student' && (!formData.matricNo || !formData.program || !formData.level)) {
                    Alert.alert('Error', 'Please fill in all student details');
                    return;
                }
                if (formData.role === 'lecturer' && (!formData.staffId || !formData.college)) {
                    Alert.alert('Error', 'Please fill in all lecturer details');
                    return;
                }
                setCurrentStep('password');
                break;
            case 'password':
                handleRegister();
                break;
        }
    };

    const handleBack = () => {
        switch (currentStep) {
            case 'role-specific':
                setCurrentStep('basic');
                break;
            case 'password':
                setCurrentStep('role-specific');
                break;
            case 'basic':
                router.back();
                break;
        }
    };

    const handleRegister = async () => {
        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const { confirmPassword, ...registrationData } = formData;
            await authStore.register(registrationData);
            // Navigation will be handled by the root layout based on user role
        } catch (error) {
            Alert.alert('Error', 'Registration failed. Please try again.');
        }
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            {['basic', 'role-specific', 'password'].map((step, index) => (
                <React.Fragment key={step}>
                    <View style={[
                        styles.stepDot,
                        currentStep === step && styles.stepDotActive
                    ]} />
                    {index < 2 && <View style={[
                        styles.stepLine,
                        currentStep === step && styles.stepLineActive
                    ]} />}
                </React.Fragment>
            ))}
        </View>
    );

    const renderBasicInfoStep = () => (
        <View style={styles.stepContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Basic Information</Text>
                <Text style={styles.subtitle}>Let&apos;s get to know you better</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="person" size={20} color={colors.textSecondary} />
                    </View>
                    <Input
                        placeholder="First Name"
                        value={formData.firstName}
                        onChangeText={(value) => updateForm('firstName', value)}
                        inputContainerStyle={styles.inputField}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="person" size={20} color={colors.textSecondary} />
                    </View>
                    <Input
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChangeText={(value) => updateForm('lastName', value)}
                        inputContainerStyle={styles.inputField}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="email" size={20} color={colors.textSecondary} />
                    </View>
                    <Input
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={(value) => updateForm('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        inputContainerStyle={styles.inputField}
                    />
                </View>
            </View>
        </View>
    );

    const renderRoleSpecificStep = () => (
        <View style={styles.stepContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {formData.role === 'student' ? 'Student Details' : 'Lecturer Details'}
                </Text>
                <Text style={styles.subtitle}>
                    {formData.role === 'student' 
                        ? 'Complete your student profile'
                        : 'Complete your lecturer profile'
                    }
                </Text>
            </View>
            <View style={styles.formContainer}>
                {formData.role === 'student' ? (
                    <>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="badge" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Matric Number"
                                value={formData.matricNo}
                                onChangeText={(value) => updateForm('matricNo', value)}
                                autoCapitalize="characters"
                                inputContainerStyle={styles.inputField}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="school" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Program"
                                value={formData.program}
                                onChangeText={(value) => updateForm('program', value)}
                                inputContainerStyle={styles.inputField}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="grade" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Level"
                                value={formData.level}
                                onChangeText={(value) => updateForm('level', value)}
                                keyboardType="numeric"
                                inputContainerStyle={styles.inputField}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="badge" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="Staff ID"
                                value={formData.staffId}
                                onChangeText={(value) => updateForm('staffId', value)}
                                autoCapitalize="characters"
                                inputContainerStyle={styles.inputField}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="business" size={20} color={colors.textSecondary} />
                            </View>
                            <Input
                                placeholder="College"
                                value={formData.college}
                                onChangeText={(value) => updateForm('college', value)}
                                inputContainerStyle={styles.inputField}
                            />
                        </View>
                    </>
                )}
            </View>
        </View>
    );

    const renderPasswordStep = () => (
        <View style={styles.stepContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Set Password</Text>
                <Text style={styles.subtitle}>Create a secure password for your account</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
                    </View>
                    <Input
                        placeholder="Password"
                        value={formData.password}
                        onChangeText={(value) => updateForm('password', value)}
                        secureTextEntry
                        inputContainerStyle={styles.inputField}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
                    </View>
                    <Input
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChangeText={(value) => updateForm('confirmPassword', value)}
                        secureTextEntry
                        inputContainerStyle={styles.inputField}
                    />
                </View>
            </View>
        </View>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'basic':
                return renderBasicInfoStep();
            case 'role-specific':
                return renderRoleSpecificStep();
            case 'password':
                return renderPasswordStep();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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
                        <View style={styles.stepIndicatorContainer}>
                            {renderStepIndicator()}
                        </View>
                        {renderCurrentStep()}
                        
                        <View style={styles.footer}>
                            <View style={styles.buttonContainer}>
            <TouchableOpacity
                                    style={[styles.button, styles.backButton]}
                                    onPress={handleBack}
                                    activeOpacity={0.8}
            >
                                    <Text style={[styles.buttonText, styles.backButtonText]}>Back</Text>
            </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.nextButton]}
                                    onPress={handleNext}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>
                                        {currentStep === 'password' ? 'Register' : 'Next'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

            <TouchableOpacity
                onPress={() => router.push('/login')}
                                style={styles.loginLink}
                                activeOpacity={0.6}
            >
                                <Text style={styles.loginLinkText}>Already have an account?</Text>
                                <Text style={styles.loginLinkTextBold}>Sign In</Text>
            </TouchableOpacity>
        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
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
    stepIndicatorContainer: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    header: {
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 32,
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
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    stepDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E0E0E0',
    },
    stepDotActive: {
        backgroundColor: colors.primary,
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 5,
    },
    stepLineActive: {
        backgroundColor: colors.primary,
    },
    stepContainer: {
        flex: 1,
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
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        height: 52,
        borderRadius: 16,
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
    backButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        shadowOpacity: 0,
        elevation: 0,
    },
    nextButton: {
        flex: 2,
        backgroundColor: colors.primary,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    backButtonText: {
        color: colors.primary,
    },
    loginLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 4,
        marginTop: 12,
    },
    loginLinkText: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '400',
    },
    loginLinkTextBold: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600',
    },
});