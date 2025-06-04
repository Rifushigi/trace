import { useState, useEffect, useCallback } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KeyboardState {
    keyboardHeight: number;
    keyboardVisible: boolean;
    keyboardWillShow: boolean;
    keyboardWillHide: boolean;
}

export const useKeyboard = () => {
    const insets = useSafeAreaInsets();
    const [keyboardState, setKeyboardState] = useState<KeyboardState>({
        keyboardHeight: 0,
        keyboardVisible: false,
        keyboardWillShow: false,
        keyboardWillHide: false,
    });

    const handleKeyboardShow = useCallback((event: KeyboardEvent) => {
        const keyboardHeight = event.endCoordinates.height;
        setKeyboardState(prev => ({
            ...prev,
            keyboardHeight,
            keyboardVisible: true,
            keyboardWillShow: false,
        }));
    }, []);

    const handleKeyboardHide = useCallback(() => {
        setKeyboardState(prev => ({
            ...prev,
            keyboardHeight: 0,
            keyboardVisible: false,
            keyboardWillHide: false,
        }));
    }, []);

    const handleKeyboardWillShow = useCallback(() => {
        setKeyboardState(prev => ({
            ...prev,
            keyboardWillShow: true,
        }));
    }, []);

    const handleKeyboardWillHide = useCallback(() => {
        setKeyboardState(prev => ({
            ...prev,
            keyboardWillHide: true,
        }));
    }, []);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        if (Platform.OS === 'ios') {
            const willShowSubscription = Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow);
            const willHideSubscription = Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide);

            return () => {
                showSubscription.remove();
                hideSubscription.remove();
                willShowSubscription.remove();
                willHideSubscription.remove();
            };
        }

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [handleKeyboardShow, handleKeyboardHide, handleKeyboardWillShow, handleKeyboardWillHide]);

    const dismissKeyboard = useCallback(() => {
        Keyboard.dismiss();
    }, []);

    return {
        // State
        keyboardHeight: keyboardState.keyboardHeight,
        keyboardVisible: keyboardState.keyboardVisible,
        keyboardWillShow: keyboardState.keyboardWillShow,
        keyboardWillHide: keyboardState.keyboardWillHide,
        bottomInset: insets.bottom,

        // Operations
        dismissKeyboard,
    };
}; 