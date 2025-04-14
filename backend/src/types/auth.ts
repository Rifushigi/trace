import mongoose from "mongoose";
import { TUserDTO } from "./user.js";
import { Document } from "mongoose";

export interface AuthResult {
    user: TUserDTO;
    accessToken: string;
}

export interface TokenPayload {
    userId: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AccessToken {
    userId: string;
}

export interface VerificationToken {
    token: string;
    createdAt?: Date;
    expiresAt: Date;
}

export interface Otp {
    code: string;
    createdAt?: Date;
    usedAt?: Date;
    expiresAt: Date;
}

export interface TVerification extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    email: string;
    verificationToken: VerificationToken;
    otp: Otp;
    isVerified: boolean;
    verifiedAt?: Date;
    updatedAt: Date;
    createdAt: Date;
}
