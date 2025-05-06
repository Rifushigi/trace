import { IAuthTokens, ITokenPayload } from "../types/index.js";
import jwt, { SignOptions } from "jsonwebtoken";
import {
    accessTokenExpiration,
    accessTokenSecret,
    refreshTokenExpiration,
    refreshTokenSecret
} from "../config/index.js";
import { JWTError } from "../middlewares/index.js";
import { Request } from "express";
import crypto from "crypto";
import { Types } from "mongoose";
import { validateSession } from "./session_service.js";

export function generateAccessToken(payload: ITokenPayload): string {
    try {
        return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiration } as SignOptions);
    } catch (error) {
        throw new JWTError("Failed to generate access token");
    }
}

export function generateRefreshToken(payload: ITokenPayload): string {
    try {
        return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiration } as SignOptions);
    } catch (error) {
        throw new JWTError("Failed to generate refresh token")
    }
}

export function generateSessionToken(): string {
    return crypto.randomUUID();
}

export function generateAuthTokens(user: ITokenPayload): IAuthTokens {
    const accessToken: string = generateAccessToken({ userId: user.userId });
    if (!accessToken) throw new JWTError("Failed to generate access token");
    const refreshToken: string = generateRefreshToken({ userId: user.userId });
    if (!refreshToken) throw new JWTError("Failed to generate refresh token");
    return {
        accessToken,
        refreshToken,
    }
}

export async function refreshAccessToken(req: Request): Promise<string> {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.cookies.deviceId;

    if (!refreshToken) {
        throw new JWTError("No refresh token provided");
    }
    if (!deviceId) {
        throw new JWTError("No device ID provided");
    }

    try {
        const payload = jwt.verify(refreshToken, refreshTokenSecret) as ITokenPayload;
        if (!payload || !payload.userId) {
            throw new JWTError("Invalid refresh token payload");
        }

        // Validate the session
        const isValidSession = await validateSession(new Types.ObjectId(payload.userId), deviceId);
        if (!isValidSession) {
            throw new JWTError("Invalid or expired session");
        }

        return generateAccessToken({ userId: payload.userId });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new JWTError("Refresh token expired");
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new JWTError("Invalid refresh token");
        }
        throw new JWTError("Token verification failed");
    }
}

export function verifyAccessToken(token: string): ITokenPayload {
    try {
        const payload = jwt.verify(token, accessTokenSecret) as ITokenPayload;
        if (!payload || !payload.userId) {
            throw new JWTError("Invalid access token payload");
        }
        return payload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new JWTError("Access token expired");
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new JWTError("Invalid access token");
        }
        throw new JWTError("Token verification failed");
    }
}