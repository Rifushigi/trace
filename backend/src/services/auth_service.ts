import { Request, Response } from "express";
import { comparePayload } from "../common";
import { AuthenticationError, ConflictError, ValueError } from "../middlewares";
import { AuthResult, AuthTokens, TUser, TUserDTO, TUserLoginDTO } from "../types";
import { generateAuthTokens } from "./jwt_service.js";
import { getUserByEmail } from "./user_service.js";
import mongoose from "mongoose";

export async function login(payload: TUserLoginDTO, req: Request): Promise<AuthResult> {
    const { email, password } = payload;
    const user: TUser | null = await getUserByEmail(email);

    if (!user?.password) throw new ValueError("User password is not set");

    if (await comparePayload(password, user?.password)) {
        const tokens: AuthTokens = generateAuthTokens({ userId: user.id });

        req.session.userId = user.id;
        req.session.refreshToken = { token: tokens.refreshToken, createdAt: new Date() };
        const userDTO: TUserDTO = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            email: user.email,
        };
        return {
            user: userDTO,
            accessToken: tokens.accessToken
        }
    }

    throw new AuthenticationError();
}

export async function logout(req: Request, res: Response): Promise<void> {
    if (!req.session.refreshToken?.token) throw new ConflictError("Invalid session");

    req.session.destroy((error) => { if (error) throw new Error("error destroying session") });

    res.clearCookie("accessToken");
}

export async function logoutAll(req: Request, res: Response): Promise<void> {

    const userId = req.session.userId;

    if (!userId) throw new AuthenticationError();

    const sessionCollection = mongoose.connection.db?.collection("sessions");
    if (sessionCollection) {
        await sessionCollection.deleteMany({
            session: { $regex: `"userId":"${userId}"` }
        })
    }

    req.session.destroy((err) => {
        if (err) throw new Error("Error destroying session")
    });

    res.clearCookie('accessToken');
}