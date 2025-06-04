import { useCallback } from 'react';
import { useStores } from '@/stores';
import { User } from '@/domain/entities/User';
import { useApi } from './useApi';
import { UserService } from '@/domain/services/user/UserService';
import { useErrorHandler } from './useErrorHandler';

export const useUser = () => {
    const { userService } = useStores();
    const { handleError } = useErrorHandler();

    const { execute: updateProfile, isLoading: isUpdatingProfile, error: updateProfileError } = useApi<User, UserService>({
        store: userService,
        action: (store) => async (data: Partial<User>) => {
            return await store.updateProfile(data);
        },
    });

    const { execute: updateProfilePicture, isLoading: isUpdatingPicture, error: updatePictureError } = useApi<User, UserService>({
        store: userService,
        action: (store) => async (imageUri: string) => {
            return await store.updateProfilePicture(imageUri);
        },
    });

    const { execute: deleteProfilePicture, isLoading: isDeletingPicture, error: deletePictureError } = useApi<User, UserService>({
        store: userService,
        action: (store) => async () => {
            return await store.deleteProfilePicture();
        },
    });

    const { execute: getProfile, isLoading: isFetchingProfile, error: fetchProfileError } = useApi<User, UserService>({
        store: userService,
        action: (store) => async () => {
            return await store.getProfile();
        },
    });

    const { execute: getAllUsers, isLoading: isFetchingUsers, error: fetchUsersError } = useApi<User[], UserService>({
        store: userService,
        action: (store) => async () => {
            return await store.getAllUsers();
        },
    });

    const handleUpdateProfile = useCallback(async (data: Partial<User>) => {
        return await handleError(async () => {
            return await updateProfile(data);
        }, 'Failed to update profile');
    }, [handleError, updateProfile]);

    const handleUpdateProfilePicture = useCallback(async (imageUri: string) => {
        return await handleError(async () => {
            return await updateProfilePicture(imageUri);
        }, 'Failed to update profile picture');
    }, [handleError, updateProfilePicture]);

    const handleDeleteProfilePicture = useCallback(async () => {
        return await handleError(async () => {
            return await deleteProfilePicture();
        }, 'Failed to delete profile picture');
    }, [handleError, deleteProfilePicture]);

    const handleGetProfile = useCallback(async () => {
        return await handleError(async () => {
            return await getProfile();
        }, 'Failed to fetch profile');
    }, [handleError, getProfile]);

    const handleGetAllUsers = useCallback(async () => {
        return await handleError(async () => {
            return await getAllUsers();
        }, 'Failed to fetch users');
    }, [handleError, getAllUsers]);

    return {
        // Loading States
        isUpdatingProfile,
        isUpdatingPicture,
        isDeletingPicture,
        isFetchingProfile,
        isFetchingUsers,

        // Error States
        updateProfileError,
        updatePictureError,
        deletePictureError,
        fetchProfileError,
        fetchUsersError,

        // Operations
        updateProfile: handleUpdateProfile,
        updateProfilePicture: handleUpdateProfilePicture,
        deleteProfilePicture: handleDeleteProfilePicture,
        getProfile: handleGetProfile,
        getAllUsers: handleGetAllUsers,
    };
};
