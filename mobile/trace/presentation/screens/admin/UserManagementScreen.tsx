import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
    ActivityIndicator,
    RefreshControl,
    Image,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../../components/common/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { User, Student, Lecturer } from '../../../domain/entities/User';
import { formatDistanceToNow } from 'date-fns';

// move it to the theme file
const BLUE = {
    primary: '#1976D2',
    light: '#E3F2FD',
    dark: '#1565C0',
    text: '#2196F3',
    background: '#F5F9FF',
};

type SortField = 'name' | 'email' | 'role' | 'date';
type SortOrder = 'asc' | 'desc';

export const UserManagementScreen = observer(() => {
    const { authStore } = useStores();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedUsers = await authStore.userUseCase.getAllUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, [authStore]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await fetchUsers();
        } finally {
            setIsRefreshing(false);
        }
    }, [fetchUsers]);

    const sortedAndFilteredUsers = useMemo(() => {
        let filtered = users.filter((user: User) => {
            const matchesSearch = (
                (user.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (user.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const matchesRole = selectedRole ? user.role === selectedRole : true;
            return matchesSearch && matchesRole;
        });

        return filtered.sort((a: User, b: User) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                    break;
                case 'email':
                    comparison = a.email.localeCompare(b.email);
                    break;
                case 'role':
                    comparison = a.role.localeCompare(b.role);
                    break;
                case 'date':
                    comparison = a.createdAt.getTime() - b.createdAt.getTime();
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [users, searchQuery, selectedRole, sortField, sortOrder]);

    const renderSortButton = (field: SortField, label: string) => (
        <TouchableOpacity
            style={[
                styles.sortButton,
                sortField === field && styles.sortButtonActive
            ]}
            onPress={() => {
                if (sortField === field) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                    setSortField(field);
                    setSortOrder('asc');
                }
            }}
        >
            <Text style={[
                styles.sortButtonText,
                sortField === field && styles.sortButtonTextActive
            ]}>
                {label}
            </Text>
            {sortField === field && (
                <MaterialIcons
                    name={sortOrder === 'asc' ? 'arrow-upward' : 'arrow-downward'}
                    size={16}
                    color={sortField === field ? BLUE.primary : '#666666'}
                />
            )}
        </TouchableOpacity>
    );

    const renderUserDetails = (user: User) => {
        const attendanceSection = user.attendanceStats && (
            <View style={styles.attendanceStats}>
                <Text style={styles.attendanceTitle}>Attendance Statistics</Text>
                <View style={styles.attendanceGrid}>
                    <View style={styles.attendanceItem}>
                        <Text style={styles.attendanceLabel}>Total Classes</Text>
                        <Text style={styles.attendanceValue}>{user.attendanceStats.totalClasses}</Text>
                    </View>
                    <View style={styles.attendanceItem}>
                        <Text style={styles.attendanceLabel}>Attended</Text>
                        <Text style={styles.attendanceValue}>{user.attendanceStats.attendedClasses}</Text>
                    </View>
                    <View style={styles.attendanceItem}>
                        <Text style={styles.attendanceLabel}>Rate</Text>
                        <Text style={[
                            styles.attendanceValue,
                            { color: user.attendanceStats.attendanceRate >= 75 ? '#10B981' : '#DC2626' }
                        ]}>{user.attendanceStats.attendanceRate.toFixed(1)}%</Text>
                    </View>
                    {user.attendanceStats.lastAttendance && (
                        <View style={styles.attendanceItem}>
                            <Text style={styles.attendanceLabel}>Last Attendance</Text>
                            <Text style={styles.attendanceValue}>
                                {formatDistanceToNow(user.attendanceStats.lastAttendance, { addSuffix: true })}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );

        switch (user.role) {
            case 'student':
                const studentUser = user as Student;
                return (
                    <View style={styles.extraDetails}>
                        <Text style={styles.detailText}>Matric No: {studentUser.matricNo}</Text>
                        <Text style={styles.detailText}>Program: {studentUser.program}</Text>
                        <Text style={styles.detailText}>Level: {studentUser.level}</Text>
                        {attendanceSection}
                    </View>
                );
            case 'lecturer':
                const lecturerUser = user as Lecturer;
                return (
                    <View style={styles.extraDetails}>
                        <Text style={styles.detailText}>Staff ID: {lecturerUser.staffId}</Text>
                        <Text style={styles.detailText}>College: {lecturerUser.college}</Text>
                        {attendanceSection}
                    </View>
                );
            default:
                return null;
        }
    };

    const renderUserItem = ({ item }: { item: User }) => (
        <Card style={styles.userCard}>
            <View style={styles.userInfo}>
                <View style={styles.userHeader}>
                    <View style={styles.userAvatar}>
                        {item.avatar ? (
                            <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>
                                {item.firstName?.[0] || ''}{item.lastName?.[0] || ''}
                            </Text>
                        )}
                        {item.isVerified && (
                            <MaterialIcons
                                name="verified"
                                size={16}
                                color={BLUE.primary}
                                style={styles.verifiedIcon}
                            />
                        )}
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        <View style={styles.statusContainer}>
                            <View style={styles.roleChip}>
                                <Text style={styles.roleText}>{item.role}</Text>
                            </View>
                            <Text style={styles.dateText}>
                                Joined {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                            </Text>
                        </View>
                    </View>
                </View>
                
                {renderUserDetails(item)}
            </View>
        </Card>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BLUE.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.filterCard}>
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.filterSection}>
                    <View style={styles.roleFilter}>
                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                selectedRole === null && styles.roleButtonActive
                            ]}
                            onPress={() => setSelectedRole(null)}
                        >
                            <Text style={[
                                styles.roleButtonText,
                                selectedRole === null && styles.roleButtonTextActive
                            ]}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                selectedRole === 'student' && styles.roleButtonActive
                            ]}
                            onPress={() => setSelectedRole('student')}
                        >
                            <Text style={[
                                styles.roleButtonText,
                                selectedRole === 'student' && styles.roleButtonTextActive
                            ]}>Students</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                selectedRole === 'lecturer' && styles.roleButtonActive
                            ]}
                            onPress={() => setSelectedRole('lecturer')}
                        >
                            <Text style={[
                                styles.roleButtonText,
                                selectedRole === 'lecturer' && styles.roleButtonTextActive
                            ]}>Lecturers</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sortContainer}>
                        {renderSortButton('name', 'Name')}
                        {renderSortButton('email', 'Email')}
                        {renderSortButton('role', 'Role')}
                        {renderSortButton('date', 'Date')}
                    </View>
                </View>
            </Card>

            <FlatList
                data={sortedAndFilteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={[BLUE.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="people" size={48} color={BLUE.primary} />
                        <Text style={styles.emptyText}>No users found</Text>
                    </View>
                }
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BLUE.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BLUE.background,
    },
    filterCard: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333333',
    },
    filterSection: {
        gap: 16,
        marginTop: 16,
    },
    roleFilter: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 4,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    roleButtonActive: {
        backgroundColor: BLUE.primary,
    },
    roleButtonText: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    roleButtonTextActive: {
        color: '#FFFFFF',
    },
    sortContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#F8F9FA',
        gap: 4,
    },
    sortButtonActive: {
        backgroundColor: BLUE.light,
    },
    sortButtonText: {
        fontSize: 14,
        color: '#666666',
    },
    sortButtonTextActive: {
        color: BLUE.primary,
        fontWeight: '500',
    },
    listContainer: {
        padding: 16,
    },
    userCard: {
        marginBottom: 12,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userInfo: {
        gap: 12,
    },
    userHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: BLUE.light,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: BLUE.primary,
    },
    verifiedIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    userDetails: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    userEmail: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 8,
    },
    roleChip: {
        backgroundColor: BLUE.light,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    roleText: {
        fontSize: 12,
        color: BLUE.primary,
        textTransform: 'capitalize',
        fontWeight: '500',
    },
    dateText: {
        fontSize: 12,
        color: '#666666',
    },
    extraDetails: {
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        gap: 4,
    },
    detailText: {
        fontSize: 14,
        color: '#666666',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
    attendanceStats: {
        marginTop: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 12,
    },
    attendanceTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    attendanceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    attendanceItem: {
        flex: 1,
        minWidth: '45%',
    },
    attendanceLabel: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
    },
    attendanceValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
}); 