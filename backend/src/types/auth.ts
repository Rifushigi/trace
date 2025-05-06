import mongoose from "mongoose";
import { IUserDTO } from "./user.js";
import { Document } from "mongoose";

export interface IAuthResult {
    user: IUserDTO;
    accessToken: string;
}

export interface ITokenPayload {
    userId: string;
}

export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface IAccessToken {
    userId: string;
}

export interface IVerificationToken {
    token: string;
    createdAt?: Date;
    expiresAt: Date;
}

export interface IOtp {
    code: string;
    createdAt?: Date;
    usedAt?: Date;
    expiresAt: Date;
}

export interface IVerification extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    email: string;
    verificationToken: IVerificationToken;
    otp: IOtp;
    isVerified: boolean;
    verifiedAt?: Date;
    updatedAt: Date;
    createdAt: Date;
}

export interface IUserLoginDTO {
    email: string;
    password: string;
}
