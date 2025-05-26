import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StoreProvider } from './src/stores';

export default function App() {
    return (
        <StoreProvider>
            <SafeAreaProvider>
                <RootNavigator />
            </SafeAreaProvider>
        </StoreProvider>
    );
} 