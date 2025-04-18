import { Model } from "mongoose";
import { Verification } from "../models";
import { Otp, TVerification, VerificationToken } from "../types";
import { randomBytes } from "crypto";
import { baseUrl, emailExp, emailFrom, otpExp, transporter } from "../config";
import path from "path";
import ejs from "ejs";
import { getUserByEmail } from "./user_service.js";
import { AuthenticationError, ConflictError, NotFoundError } from "../middlewares";
import { hashPayload, generateOtp } from "../common";

const dbModel: Model<TVerification> = Verification;
const __dirname = path.resolve();

export async function sendVerificationEmail(email: string): Promise<void> {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const verificationRecord = await dbModel.findOne({ userId: user?._id });

    if (verificationRecord?.isVerified) {
        throw new ConflictError("User is already verified");
    }

    let verificationLink;

    if (!verificationRecord) {
        const token = randomBytes(32).toString('hex');
        const verificationToken: VerificationToken = {
            token,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + emailExp)
        };
        const verification = new dbModel({
            userId: user?._id,
            updatedAt: new Date(),
            email: email,
            verificationToken: verificationToken
        });
        await verification.save();
        verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;
    } else if (new Date() > verificationRecord.verificationToken.expiresAt) {
        const token = randomBytes(32).toString('hex');
        const verificationToken: VerificationToken = {
            token,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + emailExp)
        };

        verificationRecord.verificationToken = verificationToken;
        verificationRecord.updatedAt = new Date();
        await verificationRecord.save();
        verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;
    } else {
        verificationLink = `${baseUrl}/auth/verify-email?token=${verificationRecord.verificationToken.token}`;
    }

    const templatePath = path.join(__dirname, "../views/emailTemplates/verificationEmail.ejs");
    const htmlContent = await ejs.renderFile(templatePath, {
        title: "Email Verification",
        userName: user?.firstName || "User",
        verificationLink: verificationLink,
    })
    const mailOptions = {
        from: emailFrom,
        to: email,
        subject: 'Email Verification',
        html: htmlContent
    };

    (await transporter()).sendMail(mailOptions);
}

export async function validateVerificationEmail(email: string, token: string): Promise<boolean | void> {
    const verificationRecord = await dbModel.findOne({ email });
    if (!verificationRecord) {
        throw new NotFoundError("Request for a new verfication email");
    }

    if (verificationRecord.isVerified) {
        throw new ConflictError("Email has already been verified");
    }

    const storedToken = verificationRecord.verificationToken.token;
    if (storedToken && storedToken === token) {
        verificationRecord.isVerified = true;
        verificationRecord.verifiedAt = new Date();
        verificationRecord.updatedAt = new Date();
        await verificationRecord.save();
        return true;
    }
    throw new AuthenticationError("Invalid token, request for a new verification email");
}

export async function sendOtpEmail(email: string) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const verificationRecord = await dbModel.findOne({ userId: user?._id });
    let code;

    if (!verificationRecord) {
        code = generateOtp();
        const otp: Otp = {
            code,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + otpExp)
        };
        const verification = new dbModel({
            userId: user?._id,
            updatedAt: new Date(),
            email: email,
            otp: otp
        });
        await verification.save();
    } else if (new Date() > verificationRecord.otp.expiresAt) {
        code = generateOtp();
        const otp: Otp = {
            code,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + otpExp)
        };
        verificationRecord.otp = otp;
        verificationRecord.updatedAt = new Date();
        await verificationRecord.save();
    } else {
        code = verificationRecord.otp.code;
    }

    const templatePath = path.join(__dirname, "../views/emailTemplates/otpEmail.ejs");
    const htmlContent = await ejs.renderFile(templatePath, {
        title: "Password Reset (OTP)",
        userName: user?.firstName || "User",
        otp: code
    })
    const mailOptions = {
        from: emailFrom,
        to: email,
        subject: 'Password Reset (OTP)',
        html: htmlContent
    };

    (await transporter()).sendMail(mailOptions);
}

export async function verifyOtpEmail(email: string, otp: string, password: string): Promise<boolean | void> {

    const verificationRecord = await dbModel.findOne({ email });
    if (!verificationRecord) {
        throw new NotFoundError("Request for a new otp");
    }

    if (verificationRecord?.otp.usedAt) {
        throw new ConflictError("Invalid otp");
    }

    const storedOtp = verificationRecord.otp.code;

    if (storedOtp && storedOtp === otp) {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        user.password = await hashPayload(password);
        verificationRecord.updatedAt = new Date();
        verificationRecord.otp.usedAt = new Date();
        await verificationRecord.save();
        await user.save();
        return true;
    }
    throw new AuthenticationError("Invalid otp, request for a new otp");
}