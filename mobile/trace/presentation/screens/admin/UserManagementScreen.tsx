import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { colors } from '../../../shared/constants/theme';
import { AdminStackParamList } from '../../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User } from '../../../domain/entities/User';

type Props = NativeStackScreenProps<AdminStackParamList, 'UserManagement'>;

export const UserManagementScreen = observer(({ navigation }: Props) => {
    const { authStore } = useStores();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    // Mock data - replace with actual data from your backend
    const users: User[] = [
        {
            id: '1',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'student',
            avatar: undefined,
            isVerified: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
        },
        {
            id: '2',
            email: 'jane.smith@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'lecturer',
            avatar: undefined,
            isVerified: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
        },
        // Add more mock users as needed
    ];

    const filteredUsers = users.filter((user) => {
        const matchesSearch = searchQuery === '' ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === null || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const handleRoleChange = (userId: string, newRole: string) => {
        Alert.alert(
            'Change Role',
            'Are you sure you want to change this user\'s role?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Change',
                    onPress: () => {
                        // TODO: Implement role change
                        Alert.alert('Success', 'User role updated successfully');
                    },
                },
            ]
        );
    };

    const handleAccountAction = (userId: string, action: string) => {
        switch (action) {
            case 'disable':
                Alert.alert(
                    'Disable Account',
                    'Are you sure you want to disable this account?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Disable',
                            style: 'destructive',
                            onPress: () => {
                                // TODO: Implement account disable
                                Alert.alert('Success', 'Account disabled successfully');
                            },
                        },
                    ]
                );
                break;
            case 'delete':
                Alert.alert(
                    'Delete Account',
                    'Are you sure you want to delete this account? This action cannot be undone.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                                // TODO: Implement account deletion
                                Alert.alert('Success', 'Account deleted successfully');
                            },
                        },
                    ]
                );
                break;
        }
    };

    const renderUserItem = ({ item }: { item: User }) => (
        <Card style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userRole}>Role: {item.role}</Text>
            </View>
            <View style={styles.userActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRoleChange(item.id, item.role === 'student' ? 'lecturer' : 'student')}
                >
                    <Text style={styles.actionButtonText}>Change Role</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.disableButton]}
                    onPress={() => handleAccountAction(item.id, 'disable')}
                >
                    <Text style={[styles.actionButtonText, styles.disableButtonText]}>
                        Disable Account
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleAccountAction(item.id, 'delete')}
                >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                        Delete Account
                    </Text>
                </TouchableOpacity>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            {/* Search and Filter */}
            <Card style={styles.filterCard}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View style={styles.roleFilter}>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            selectedRole === null && styles.roleButtonActive,
                        ]}
                        onPress={() => setSelectedRole(null)}
                    >
                        <Text style={styles.roleButtonText}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            selectedRole === 'student' && styles.roleButtonActive,
                        ]}
                        onPress={() => setSelectedRole('student')}
                    >
                        <Text style={styles.roleButtonText}>Students</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            selectedRole === 'lecturer' && styles.roleButtonActive,
                        ]}
                        onPress={() => setSelectedRole('lecturer')}
                    >
                        <Text style={styles.roleButtonText}>Lecturers</Text>
                    </TouchableOpacity>
                </View>
            </Card>

            {/* User List */}
            <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    filterCard: {
        margin: 16,
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    roleFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    roleButton: {
        flex: 1,
        padding: 8,
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: colors.card,
        alignItems: 'center',
    },
    roleButtonActive: {
        backgroundColor: colors.primary,
    },
    roleButtonText: {
        color: colors.text,
    },
    listContainer: {
        padding: 16,
    },
    userCard: {
        marginBottom: 16,
        padding: 16,
    },
    userInfo: {
        marginBottom: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: colors.primary,
    },
    userActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
        marginBottom: 8,
        alignItems: 'center',
        backgroundColor: colors.primary,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    disableButton: {
        backgroundColor: colors.warning,
    },
    disableButtonText: {
        color: '#FFFFFF',
    },
    deleteButton: {
        backgroundColor: colors.error,
    },
    deleteButtonText: {
        color: '#FFFFFF',
    },
}); 