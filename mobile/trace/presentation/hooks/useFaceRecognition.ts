import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export type FaceRecognitionStatus = 'checking' | 'granted' | 'denied' | 'unavailable';

export const useFaceRecognition = () => {
    const [status, setStatus] = useState<FaceRecognitionStatus>('checking');
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

    useEffect(() => {
        checkFaceRecognitionStatus();
    }, []);

    const checkFaceRecognitionStatus = async () => {
        try {
            // Check if face recognition is available on the device
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

            const hasFaceRecognition = supportedTypes.includes(
                LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
            );

            if (!hasHardware || !hasFaceRecognition) {
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
            setIsEnrolled(true);
        } catch (error) {
            console.error('Error checking face recognition status:', error);
            setStatus('denied');
            setIsAvailable(false);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Please authenticate using face recognition',
                fallbackLabel: 'Use passcode',
                disableDeviceFallback: false,
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
            console.error('Error requesting face recognition permission:', error);
            setStatus('denied');
            setIsAvailable(false);
            return false;
        }
    };

    const verifyFace = async (): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Please verify your face',
                fallbackLabel: 'Use passcode',
                disableDeviceFallback: false,
            });

            return result.success;
        } catch (error) {
            console.error('Error verifying face:', error);
            return false;
        }
    };

    return {
        status,
        isAvailable,
        isEnrolled,
        requestPermission,
        verifyFace,
        checkFaceRecognitionStatus,
    };
}; 