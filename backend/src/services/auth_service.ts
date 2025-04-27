import { Request, Response } from "express";
import { comparePayload } from "../common";
import { AuthenticationError, ConflictError, ValueError } from "../middlewares";
import { AuthResult, AuthTokens, TUser, TUserDTO, TUserLoginDTO } from "../types";
import { generateAuthTokens } from "./jwt_service.js";
import { getUserByEmail } from "./user_service.js";
import { invalidateExistingSessions, createNewSession } from "./session_service.js";

export const login = async (payload: TUserLoginDTO, req: Request): Promise<AuthResult> => {
    const { email, password } = payload;
    const user: TUser | null = await getUserByEmail(email);

    if (!user) throw new ValueError("User not found");
    if (!user.password) throw new ValueError("User password is not set");
    if (!user.isVerified) throw new AuthenticationError("User email is not verified");

    const isPasswordValid = await comparePayload(password, user.password);
    if (!isPasswordValid) {
        throw new AuthenticationError("Invalid password");
    }

    // Invalidate existing sessions
    await invalidateExistingSessions(req);

    // Create new session
    const sessionToken = await createNewSession(req, user._id.toString());

    // Generate auth tokens
    const { accessToken, refreshToken }: AuthTokens = generateAuthTokens({
        userId: user._id.toString()
    });

    // Create user DTO with only necessary fields
    const userDTO: TUserDTO = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
    };

    // Set refresh token in session
    req.session.refreshToken = { token: refreshToken, createdAt: new Date() };

    return {
        user: userDTO,
        accessToken,
        sessionToken
    };
};

export async function logout(req: Request, res: Response): Promise<void> {
    if (!req.session.refreshToken?.token) throw new ConflictError("Invalid session");

    req.session.destroy((error) => { if (error) throw new Error("error destroying session") });

    res.clearCookie("accessToken");
}