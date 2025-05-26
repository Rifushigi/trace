import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import * as ImagePicker from 'expo-image-picker';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'EditProfile'>;

export const EditProfileScreen = observer(() => {
    const navigation = useNavigation<EditProfileScreenNavigationProp>();
    const { authStore } = useStores();
    const { user } = authStore.authState;

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Please grant permission to access your photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!firstName || !lastName) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            await authStore.updateProfile({
                firstName,
                lastName,
                avatar,
            });
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.profileImageContainer}
                    onPress={handlePickImage}
                >
                    <Image
                        source={
                            avatar
                                ? { uri: avatar }
                                : require('../../../assets/images/default-avatar.png')
                        }
                        style={styles.profileImage}
                    />
                    <View style={styles.editOverlay}>
                        <Text style={styles.editText}>Change Photo</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="Enter your first name"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Enter your last name"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={user.email}
                        editable={false}
                    />
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
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
    editOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    form: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    disabledInput: {
        backgroundColor: '#f8f9fa',
        color: '#666',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 