import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Student, Lecturer, Admin } from '../../../domain/entities/User';
import { colors } from '../../../shared/constants/theme';

export const ProfileScreen = observer(() => {
    const { authStore } = useStores();
    const { user } = authStore.authState;

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authStore.logout();
                            router.replace('/welcome');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    if (!user) {
        return null;
    }

    const renderRoleSpecificInfo = () => {
        switch (user.role) {
            case 'student':
                const student = user as Student;
                return (
                    <View style={styles.roleInfo}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Matric Number</Text>
                            <Text style={styles.infoValue}>{student.matricNo}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Program</Text>
                            <Text style={styles.infoValue}>{student.program}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Level</Text>
                            <Text style={styles.infoValue}>{student.level}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Face ID Status</Text>
                            <Text style={styles.infoValue}>
                                {student.faceModelId ? 'Registered' : 'Not Registered'}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>NFC Status</Text>
                            <Text style={styles.infoValue}>
                                {student.nfcUid ? 'Registered' : 'Not Registered'}
                            </Text>
                        </View>
                    </View>
                );
            case 'lecturer':
                const lecturer = user as Lecturer;
                return (
                    <View style={styles.roleInfo}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Staff ID</Text>
                            <Text style={styles.infoValue}>{lecturer.staffId}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>College</Text>
                            <Text style={styles.infoValue}>{lecturer.college}</Text>
                        </View>
                    </View>
                );
            case 'admin':
                const admin = user as Admin;
                return (
                    <View style={styles.roleInfo}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Role</Text>
                            <Text style={styles.infoValue}>Administrator</Text>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    const renderRoleSpecificActions = () => {
        switch (user.role) {
            case 'student':
                return (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/device-setup')}
                    >
                        <Text style={styles.actionButtonText}>Device Setup</Text>
                    </TouchableOpacity>
                );
            case 'lecturer':
                return (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/class-management')}
                    >
                        <Text style={styles.actionButtonText}>Manage Classes</Text>
                    </TouchableOpacity>
                );
            case 'admin':
                return (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/user-management')}
                    >
                        <Text style={styles.actionButtonText}>Manage Users</Text>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={
                            user.avatar
                                ? { uri: user.avatar }
                                : require('../../../assets/images/icon.png')
                        }
                        style={styles.profileImage}
                    />
                </View>
                <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.role}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
            </View>

            {renderRoleSpecificInfo()}

            <View style={styles.actions}>
                {renderRoleSpecificActions()}

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push('/(profile)/edit')}
                >
                    <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push('/(settings)')}
                >
                    <Text style={styles.actionButtonText}>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: colors.primary,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.text,
    },
    email: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 5,
    },
    role: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    roleInfo: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoItem: {
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    actions: {
        padding: 20,
    },
    actionButton: {
        backgroundColor: colors.card,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionButtonText: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: colors.background,
        borderColor: colors.error,
    },
    logoutButtonText: {
        color: colors.error,
    },
}); 