import { body, param, query } from "express-validator";

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
    body('email')
        .trim()
        .notEmpty()
        .escape()
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .trim()
        .notEmpty()
        .escape()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .trim()
        .notEmpty()
        .escape()
        .isIn(['admin', 'lecturer', 'student'])
        .withMessage('Role must be one of: admin, lecturer, student'),
    body('isVerified')
        .optional()
        .isBoolean()
        .withMessage('isVerified must be a boolean'),
    body('matricNo')
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage('matricNo must be a string'),
    body('program')
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage('program must be a string'),
    body('level')
        .optional()
        .isInt({ min: 1 })
        .withMessage('level must be a positive integer'),
    body('faceModelId')
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage('faceModelId must be a string'),
    body('nfcUid')
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage('nfcUid must be a string'),
    body('bleToken')
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage('bleToken must be a string'),
    body('staffId')
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage('staffId must be a string'),
    body('college')
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage('college must be a string'),
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