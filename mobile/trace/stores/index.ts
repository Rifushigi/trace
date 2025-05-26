import { createContext, useContext } from 'react';
import { RootStore } from './RootStore';

export const StoreContext = createContext<RootStore | null>(null);

export const useStores = () => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStores must be used within a StoreProvider');
    }
    return store;
}; 