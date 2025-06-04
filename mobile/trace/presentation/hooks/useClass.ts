import { useStores } from '@/stores';
import { Class } from '@/domain/entities/Class';
import { useApi } from './useApi';

export const useClass = () => {
    const { classStore } = useStores();

    const { execute: getClasses, isLoading: isLoadingClasses, error: classesError } = useApi<Class[], typeof classStore>({
        store: classStore,
        action: (store) => async () => {
            await store.getClasses();
            return store.classes;
        },
    });

    const { execute: getClass, isLoading: isLoadingClass, error: classError } = useApi<Class, typeof classStore>({
        store: classStore,
        action: (store) => (id: string) => store.getClass(id),
    });

    const { execute: createClass, isLoading: isCreatingClass, error: createClassError } = useApi<Class, typeof classStore>({
        store: classStore,
        action: (store) => (data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => store.createClass(data),
    });

    const { execute: updateClass, isLoading: isUpdatingClass, error: updateClassError } = useApi<Class, typeof classStore>({
        store: classStore,
        action: (store) => (id: string, data: Partial<Class>) => store.updateClass(id, data),
    });

    const { execute: deleteClass, isLoading: isDeletingClass, error: deleteClassError } = useApi<void, typeof classStore>({
        store: classStore,
        action: (store) => (id: string) => store.deleteClass(id),
    });

    return {
        // State
        classes: classStore.classes,

        // Loading States
        isLoadingClasses,
        isLoadingClass,
        isCreatingClass,
        isUpdatingClass,
        isDeletingClass,

        // Error States
        classesError,
        classError,
        createClassError,
        updateClassError,
        deleteClassError,

        // Operations
        getClasses,
        getClass,
        createClass,
        updateClass,
        deleteClass,
    };
}; 