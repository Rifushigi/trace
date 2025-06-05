import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export type NFCStatus = 'checking' | 'granted' | 'denied' | 'unavailable';

export const useNFC = () => {
    const [status, setStatus] = useState<NFCStatus>('checking');
    const [isAvailable, setIsAvailable] = useState<boolean>(false);

    useEffect(() => {
        checkNFCStatus();
    }, []);

    const checkNFCStatus = async () => {
        try {
            // Check if NFC is available on the device
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware) {
                setStatus('unavailable');
                setIsAvailable(false);
                return;
            }

            if (!isEnrolled) {
                setStatus('denied');
                setIsAvailable(false);
                return;
            }

            setStatus('granted');
            setIsAvailable(true);
        } catch (error) {
            console.error('Error checking NFC status:', error);
            setStatus('denied');
            setIsAvailable(false);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Please authenticate to enable NFC',
                fallbackLabel: 'Use passcode',
            });

            if (result.success) {
                setStatus('granted');
                setIsAvailable(true);
                return true;
            } else {
                setStatus('denied');
                setIsAvailable(false);
                return false;
            }
        } catch (error) {
            console.error('Error requesting NFC permission:', error);
            setStatus('denied');
            setIsAvailable(false);
            return false;
        }
    };

    return {
        status,
        isAvailable,
        requestPermission,
        checkNFCStatus,
    };
}; 