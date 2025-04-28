export interface BiometricAuthDTO {
    userId: string;
    biometricData: string;
    deviceId?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export interface BiometricVerificationResult {
    match: boolean;
    confidence: number;
    face_id?: string;
}

export interface BiometricRegistrationResult {
    face_id: string;
} 