import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/constants/theme';

export type UserRole = 'student' | 'lecturer';

interface RoleSelectionScreenProps {
    selectedRole: UserRole | null;
    onRoleSelect: (role: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
    selectedRole,
    onRoleSelect,
}) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.subtitle}>Choose your role to continue</Text>
                </View>
                
                <View style={styles.mainContent}>
                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                selectedRole === 'student' && styles.roleCardActive,
                            ]}
                            onPress={() => onRoleSelect('student')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.roleIconContainer}>
                                <MaterialCommunityIcons
                                    name="school-outline" 
                                    size={40} 
                                    color={selectedRole === 'student' ? colors.white : colors.textSecondary} 
                                />
                            </View>
                            <Text style={[
                                styles.roleTitle,
                                selectedRole === 'student' && styles.roleTitleActive
                            ]}>
                                Student
                            </Text>
                            <Text style={[
                                styles.roleDescription,
                                selectedRole === 'student' && styles.roleDescriptionActive
                            ]}>
                                Access courses and learning materials
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                selectedRole === 'lecturer' && styles.roleCardActive,
                            ]}
                            onPress={() => onRoleSelect('lecturer')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.roleIconContainer}>
                                <View style={styles.roleIconContainer}>
                                    <MaterialCommunityIcons 
                                        name="account-tie" 
                                        size={40} 
                                        color={selectedRole === 'lecturer' ? colors.white : colors.textSecondary} 
                                    />
                                </View>
                            </View>
                            <Text style={[
                                styles.roleTitle,
                                selectedRole === 'lecturer' && styles.roleTitleActive
                            ]}>
                                Lecturer
                            </Text>
                            <Text style={[
                                styles.roleDescription,
                                selectedRole === 'lecturer' && styles.roleDescriptionActive
                            ]}>
                                Create and manage courses
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            !selectedRole && styles.continueButtonDisabled
                        ]}
                        onPress={() => selectedRole && router.push({
                            pathname: '/register',
                            params: { role: selectedRole }
                        })}
                        disabled={!selectedRole}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/login')}
                        style={styles.loginLink}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.loginLinkText}>Already have an account?</Text>
                        <Text style={styles.loginLinkTextBold}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const { height } = Dimensions.get('window');
const HORIZONTAL_PADDING = 24;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    content: {
        flex: 1,
        paddingHorizontal: HORIZONTAL_PADDING,
    },
    header: {
        alignItems: 'center',
        paddingTop: height * 0.14,
        paddingBottom: 12,
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
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    roleContainer: {
        width: '100%',
        gap: 20,
    },
    roleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    roleCardActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    roleIconContainer: {
        marginBottom: 16,
    },
    roleIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#E5E7EB',
        borderRadius: 24,
    },
    lecturerIcon: {
        backgroundColor: '#F3F4F6',
    },
    roleIconActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    roleTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    roleTitleActive: {
        color: '#FFFFFF',
    },
    roleDescription: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    roleDescriptionActive: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    footer: {
        paddingBottom: height * 0.08,
        paddingTop: 20,
    },
    continueButton: {
        backgroundColor: colors.primary,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonDisabled: {
        backgroundColor: '#E5E7EB',
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    loginLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 4,
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