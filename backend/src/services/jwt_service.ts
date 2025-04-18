import { AuthTokens, TokenPayload } from "../types";
import jwt, { SignOptions } from "jsonwebtoken";
import { accessTokenExpiration, accessTokenSecret, refreshTokenExpiration, refreshTokenSecret, tokenRotationDays } from "../config";
import { JWTError } from "../middlewares";
import { Request } from "express";
import { isWithinDays } from "../common";

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

export async function refreshAccessToken(req: Request): Promise<string | void> {
    if (!req.session.refreshToken || !req.session.refreshToken.token) {
        throw new JWTError("Invalid refresh token");
    }

    let payload: TokenPayload;

    try {
        payload = jwt.verify(req.session.refreshToken.token, refreshTokenSecret) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new JWTError("Refresh token expired");
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new JWTError("Invalid refresh token");
        }
        throw new JWTError("Token verification failed");
    }

    const tokenCreationDate = new Date(req.session.refreshToken.createdAt);
    const shouldRotateToken = !isWithinDays(tokenCreationDate, parseInt(tokenRotationDays));

    if (shouldRotateToken) {
        const newAuthTokens = generateAuthTokens({ userId: payload.userId });
        req.session.refreshToken.token = newAuthTokens.refreshToken;
        req.session.refreshToken.createdAt = new Date();
        return generateAccessToken({ userId: payload.userId });
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

export function generateAuthTokens(user: TokenPayload): AuthTokens {
    const accessToken: string = generateAccessToken({ userId: user.userId });
    const refreshToken: string = generateRefreshToken({ userId: user.userId });
    return {
        accessToken,
        refreshToken,
    }
}