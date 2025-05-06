import { verifyAccessToken } from "../services/jwt_service.js";
import { IAccessToken, IAuthenticatedRequest } from "../types/index.js";
import { middlewareErrorHandler, UnauthorizedError } from "./error_handler.js";
import { NextFunction, Response, Request } from "express";
import { validateSession } from "../services/session_service.js";
import { Types } from "mongoose";

export const sessionMiddleware = middlewareErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedError("Missing JWT token");

    const decoded: IAccessToken = verifyAccessToken(token);
    const userId: string = decoded.userId;
    const deviceId = req.cookies.deviceId;

    if (!deviceId) {
        throw new UnauthorizedError("Missing device ID");
    }

    // Validate the session
    const isValidSession = await validateSession(new Types.ObjectId(userId), deviceId);
    if (!isValidSession) {
        throw new UnauthorizedError("Invalid or expired session");
    }

    (req as unknown as IAuthenticatedRequest).user = { _id: userId } as any;
    next();
});