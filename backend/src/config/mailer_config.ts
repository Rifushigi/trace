import nodemailer from 'nodemailer';
import { smtpHost, smtpPass, smtpPort, smtpSecure, smtpUser } from './index.js';
import { AppError } from '../middlewares/index.js';

const secure = smtpSecure;
const port = smtpPort;
const host = smtpHost;

export async function transporter() {
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        tls: {
            rejectUnauthorized: true, // Ignore self-signed SSL certificates
        },
    });

    try {
        await transporter.verify();
    } catch (error) {
        throw new AppError(500, "Internal server error", true, error);
    }
    return transporter;
};