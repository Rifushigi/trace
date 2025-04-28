import { Request, Response, NextFunction } from "express";
import { middlewareErrorHandler, ForbiddenError } from "./error_handler.js";
import { User } from "../models/user_model.js";

export const requireAdmin = middlewareErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
        throw new ForbiddenError("Admin access required");
    }
    next();
});

export const requireLecturer = middlewareErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'lecturer') {
        throw new ForbiddenError("Lecturer access required");
    }
    next();
});

export const requireStudent = middlewareErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'student') {
        throw new ForbiddenError("Student access required");
    }
    next();
}); 