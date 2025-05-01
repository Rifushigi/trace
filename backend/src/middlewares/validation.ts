import { body, param, query } from "express-validator";

export const biometricSignInValidationRules = [
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('biometricData').isString().notEmpty().withMessage('Biometric data is required'),
    body('deviceId').optional().isString().withMessage('Invalid device ID'),
    body('location').optional().isObject().withMessage('Invalid location format'),
    body('location.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('location.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

export const biometricRegisterValidationRules = [
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('biometricData').isString().notEmpty().withMessage('Biometric data is required')
];

export const attendanceSessionValidationRules = [
    body('classId').isMongoId().withMessage('Invalid class ID'),
    body('startTime').optional().isISO8601().withMessage('Invalid start time')
];

export const checkInValidationRules = [
    body('sessionId').isMongoId().withMessage('Invalid session ID'),
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('method').isIn(['face', 'nfc', 'ble', 'geofence']).withMessage('Invalid check-in method'),
    body('biometricData').optional().isString().withMessage('Invalid biometric data'),
    body('deviceId').optional().isString().withMessage('Invalid device ID'),
    body('location').optional().isObject().withMessage('Invalid location data')
];

export const automaticCheckInValidationRules = [
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('sessionId').isMongoId().withMessage('Invalid session ID'),
    body('location').isString().withMessage('Invalid location'),
    body('confidence').isFloat({ min: 0, max: 1 }).withMessage('Invalid confidence score'),
    body('timestamp').isISO8601().withMessage('Invalid timestamp')
];

export const sessionIdValidationRules = [
    param('sessionId').isMongoId().withMessage('Invalid session ID')
];

export const studentClassValidationRules = [
    param('studentId').isMongoId().withMessage('Invalid student ID'),
    param('classId').isMongoId().withMessage('Invalid class ID')
];

export const userSignUpValidationRules = [
    body('email').trim().notEmpty().escape().isEmail().withMessage('email is required'),
    body('password').trim().notEmpty().escape().isLength({ min: 6 }).withMessage('password is required'),
];

export const userSignInValidationRules = [
    body('email').trim().notEmpty().escape().isEmail().withMessage('Email is required'),
    body('password').trim().notEmpty().escape().isLength({ min: 6 }).withMessage('Password is required')
];

export const classValidationRules = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('courseCode').trim().notEmpty().withMessage('Course code is required'),
    body('semester').trim().notEmpty().withMessage('Semester is required'),
    body('year').isInt({ min: 2000 }).withMessage('Year must be a valid year')
];

export const classIdValidationRules = [
    param('classId').isMongoId().withMessage('Invalid class ID')
];

export const studentIdValidationRules = [
    param('studentId').isMongoId().withMessage('Invalid student ID')
];

export const searchValidationRules = [
    query('title').optional().isString(),
    query('courseCode').optional().isString(),
    query('semester').optional().isString(),
    query('year').optional().isInt({ min: 2000 }),
    query('lecturerId').optional().isMongoId()
]; 