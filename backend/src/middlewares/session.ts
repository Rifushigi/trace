import { verifyAccessToken } from "../services/jwt_service.js";
import { AccessToken } from "../types";
import { middlewareErrorHandler, ForbiddenError, UnauthorizedError } from "./error_handler.js";
import { NextFunction, Response, Request } from "express";
import { validateSession } from "../services/session_service.js";

export const sessionMiddleware = middlewareErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const sessionToken = req.headers['x-session-token'];

    if (!token) throw new UnauthorizedError("Missing JWT token");
    if (!sessionToken) throw new UnauthorizedError("Missing session token");

    const decoded: AccessToken = verifyAccessToken(token);
    const userId: string = decoded.userId;

    // Validate session token
    const isValidSession = await validateSession(req, sessionToken);
    if (!isValidSession) {
        throw new ForbiddenError("Session invalid or expired");
    }

    req.session.userId = userId;
    next();
});