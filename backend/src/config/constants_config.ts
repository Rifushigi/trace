import dotenv from 'dotenv';

dotenv.config();

// TODO
// add the firebase env variables
const firebaseProjectId: string = process.env.FIREBASE_PROJECT_ID!;
const firebaseClientEmail: string = process.env.FIREBASE_CLIENT_EMAIL!;
const firebasePrivateKey: string = process.env.FIREBASE_PRIVATE_KEY!;
const baseUrl: string = process.env.BASE_URL!;
const emailFrom: string = process.env.EMAIL_FROM!;
const emailExp: number = parseInt(process.env.EMAIL_EXP || "86400000");//time-ms
const otpExp: number = parseInt(process.env.OTP_EXP || "600000"); //time-ms
const smtpUser: string = process.env.SMTP_USER!;
const smtpPass: string = process.env.SMTP_PASS!;
const smtpHost: string = process.env.SMTP_HOST || "smtp.ethereal.email";
const smtpPort: number = parseInt(process.env.SMTP_PORT || "587");
const smtpSecure: boolean = process.env.SMTP_SECURE === 'true';
const cldnCloudName: string = process.env.CLOUD_NAME!;
const cldnApiKey: string = process.env.CLOUDINARY_API_KEY!;
const cldnApiSecret: string = process.env.CLOUDINARY_API_SECRET!;
const cldnDir: string = process.env.CLOUDINARY_DIRECTORY!;
const port: number = parseInt(process.env.PORT || '3000');
const localDBUrl: string = process.env.LOCAL_DATABASE_URL!;
const prdDBUrl: string = process.env.PRD_DATABASE_URL!;
const env: string = process.env.ENV!;
const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET!;
const accessTokenExpiration: string = process.env.ACCESS_TOKEN_DURATION || "1h";
const refreshTokenExpiration: string = process.env.REFRESH_TOKEN_DURATION || "7d";

const requiredEnvVars = [
    'EMAIL_FROM',
    'EMAIL_EXP',
    'OTP_EXP',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_DIRECTORY',
    'CLOUDINARY_API_SECRET',
    'BASE_URL',
    'PORT',
    'PRD_DATABASE_URL',
    'ENV',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_DURATION',
    'REFRESH_TOKEN_DURATION',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
];

export {
    baseUrl,
    emailFrom,
    emailExp,
    otpExp,
    smtpUser,
    smtpPass,
    smtpHost,
    smtpPort,
    smtpSecure,
    cldnDir,
    cldnCloudName,
    cldnApiKey,
    cldnApiSecret,
    port,
    localDBUrl,
    prdDBUrl,
    env,
    accessTokenExpiration,
    refreshTokenExpiration,
    accessTokenSecret,
    refreshTokenSecret,
    requiredEnvVars,
    firebaseClientEmail,
    firebaseProjectId,
    firebasePrivateKey
}
