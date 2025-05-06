import { Request, Response, NextFunction } from "express";
import { middlewareErrorHandler, ForbiddenError } from "./error_handler.js";
import { User } from "../models/user_model.js";
import { verifyAccessToken } from "../services/jwt_service.js";

export const requireAdmin = middlewareErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) throw new ForbiddenError("No access token provided");

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'admin') {
        throw new ForbiddenError("Admin access required");
    }
    next();
});

export const requireLecturer = middlewareErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) throw new ForbiddenError("No access token provided");

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'lecturer') {
        throw new ForbiddenError("Lecturer access required");
    }
    next();
});

export const requireStudent = middlewareErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) throw new ForbiddenError("No access token provided");

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'student') {
        throw new ForbiddenError("Student access required");
    }
    next();
}); 