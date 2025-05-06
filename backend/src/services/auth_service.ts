import { Response } from "express";
import { comparePayload } from "../utils/index.js";
import { AuthenticationError, ValueError, JWTError, SessionError } from "../middlewares/index.js";
import {
    IAuthResult,
    IAuthTokens,
    IUser,
    IUserDTO,
    IUserLoginDTO,
    IAuthenticatedRequest
} from "../types/index.js";
import { generateAuthTokens } from "./jwt_service.js";
import { getUserByEmail } from "./user_service.js";
import { accessTokenExpiration, refreshTokenExpiration } from "../config/index.js";
import { createSession, validateSession, invalidateSession } from "./session_service.js";
import { Types } from "mongoose";

export const login = async (payload: IUserLoginDTO, req: IAuthenticatedRequest, res: Response): Promise<IAuthResult> => {
    const { email, password } = payload;
    const user: IUser | null = await getUserByEmail(email);

    if (!user) throw new ValueError("User not found");
    if (!user.password) throw new ValueError("User password is not set");
    if (!user.isVerified) throw new AuthenticationError("User email is not verified");

    const isPasswordValid = await comparePayload(password, user.password);
    if (!isPasswordValid) {
        throw new AuthenticationError("Invalid password");
    }

    // Generate auth tokens
    const { accessToken, refreshToken }: IAuthTokens = generateAuthTokens({
        userId: user._id.toString(),
    });

    // Create new session and get device ID
    const deviceId = await createSession(
        new Types.ObjectId(user._id),
        accessToken,
        refreshToken
    );

    // Set cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseInt(accessTokenExpiration) * 1000 // Convert to milliseconds
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseInt(refreshTokenExpiration) * 1000 // Convert to milliseconds
    });

    res.cookie('deviceId', deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseInt(refreshTokenExpiration) * 1000 // Convert to milliseconds
    });

    // Create user DTO with only necessary fields
    const userDTO: IUserDTO = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
    };

    return {
        user: userDTO,
        accessToken,
    };
};

export const logout = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
    // Clear all authentication cookies
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.clearCookie('deviceId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    // Clear any authorization headers
    delete req.headers.authorization;
};

export async function refreshToken(userId: Types.ObjectId, deviceId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!userId || !deviceId || !refreshToken) {
        throw new SessionError("Invalid session parameters");
    }

    const isValidSession = await validateSession(userId, deviceId);
    if (!isValidSession) {
        throw new SessionError("Invalid session");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateAuthTokens({ userId: userId.toString() });
    await createSession(userId, accessToken, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
}