import { body } from 'express-validator';

export const userSignUpValidationRules = [
    body('email').trim().notEmpty().escape().isEmail().withMessage('email is required'),
    body('password').trim().notEmpty().escape().isLength({ min: 6 }).withMessage('password is required'),
];

export const userSignInValidationRules = [
    body('email').trim().notEmpty().escape().isEmail().withMessage('Email is required'),
    body('password').trim().notEmpty().escape().isLength({ min: 6 }).withMessage('Password is required')
];
