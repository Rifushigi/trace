import { asyncErrorHandler } from "../middlewares/index.js";
import { Response, Request } from "express";
import { login, logout } from "../services/auth_service.js"
import { TUserDTO, TResponseDTO } from "../types/index.js";
import { refreshAccessToken } from "../services/jwt_service.js";
import { sendOtpEmail, sendVerificationEmail, validateVerificationEmail, verifyOtpEmail } from "../services/email_service.js";


export const signIn = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken } = await login({ email, password }, req);

    const userDTO: TUserDTO = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
    };

    const response: TResponseDTO = {
        status: true,
        data: { user: userDTO, token: accessToken },
        message: "Successfully logged in"
    };

    return res.status(200).json({ response });
});

export const refreshToken = asyncErrorHandler(async (req: Request, res: Response) => {
    const token = await refreshAccessToken(req);

    let response: TResponseDTO;

    if (token) {
        response = {
            status: true,
            data: token,
            message: "Successfully refreshed token"
        };
    } else {
        response = {
            status: true,
            message: "Token is valid and does not need to be refreshed"
        };
    }

    return res.status(200).json({ response });
});

export const signout = asyncErrorHandler(async (req: Request, res: Response) => {
    await logout(req, res);

    const response: TResponseDTO = {
        status: true,
        message: "Successfully logged out"
    };

    return res.status(200).json({ response });
});

export const sendOtp = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await sendOtpEmail(email);

    const response: TResponseDTO = {
        status: true,
        message: "Successfully sent OTP"
    };

    return res.status(200).json({ response });
});

export const verifyOtp = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email, otp, password } = req.body;
    await verifyOtpEmail(email, otp, password);

    const response: TResponseDTO = {
        status: true,
        message: "Successfully changed password"
    };
    return res.status(201).json({ response });
});

export const sendEmail = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await sendVerificationEmail(email);

    const response: TResponseDTO = {
        status: true,
        message: "Successfully sent verification email"
    };
    return res.status(201).json({ response });
});

export const verifyEmail = asyncErrorHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    await validateVerificationEmail(token as string);

    const response: TResponseDTO = {
        status: true,
        message: "Successfully verified email"
    };
    return res.status(200).json({ response });
});