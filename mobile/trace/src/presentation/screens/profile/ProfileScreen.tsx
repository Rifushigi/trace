import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Profile'>;

export const ProfileScreen = observer(() => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={
                            user.avatar
                                ? { uri: user.avatar }
                                : require('../../../assets/images/default-avatar.png')
                        }
                        style={styles.profileImage}
                    />
                </View>
                <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Settings')}
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
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    actions: {
        padding: 20,
    },
    actionButton: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    actionButtonText: {
        fontSize: 16,
        color: '#212529',
        textAlign: 'center',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderColor: '#dc3545',
    },
    logoutButtonText: {
        color: '#dc3545',
    },
}); 