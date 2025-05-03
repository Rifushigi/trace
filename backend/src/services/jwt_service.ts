import { AuthTokens, TokenPayload } from "../types/index.js";
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

export function generateAccessToken(payload: TokenPayload): string {
    try {
        return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiration } as SignOptions);
    } catch (error) {
        throw new JWTError("Failed to generate access token");
    }
}

export function generateRefreshToken(payload: TokenPayload): string {
    try {
        return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiration } as SignOptions);
    } catch (error) {
        throw new JWTError("Failed to generate refresh token")
    }
}

export function generateSessionToken(): string {
    return crypto.randomUUID();
}

export function generateAuthTokens(user: TokenPayload): AuthTokens {
    const accessToken: string = generateAccessToken({ userId: user.userId });
    const refreshToken: string = generateRefreshToken({ userId: user.userId });
    return {
        accessToken,
        refreshToken,
    }
}

export async function refreshAccessToken(req: Request): Promise<string | void> {
    if (!req.session.refreshToken || !req.session.refreshToken.token) {
        throw new JWTError("Invalid refresh token");
    }

    try {
        const payload = jwt.verify(req.session.refreshToken.token, refreshTokenSecret) as TokenPayload;
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

export function verifyAccessToken(token: string): TokenPayload {
    try {
        return jwt.verify(token, accessTokenSecret) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new JWTError("Access token expired");
        }
        throw new JWTError("Invalid access token");
    }
}