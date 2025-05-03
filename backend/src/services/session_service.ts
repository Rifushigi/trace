import { DatabaseError } from "../middlewares/index.js";
import { generateSessionToken } from "./jwt_service.js";
import { Request } from "express";

export const invalidateExistingSessions = async (req: Request): Promise<void> => {
    try {
        req.session.destroy((error) => {
            if (error) throw new DatabaseError("Failed to destroy session");
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to invalidate sessions: ${error.message}`);
        }
        throw error;
    }
};

export const validateSession = async (req: Request, sessionToken: string | string[]): Promise<boolean> => {
    try {
        return Boolean(req.session.userId && req.session.sessionToken === sessionToken);
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to validate session: ${error.message}`);
        }
        throw error;
    }
};

export const createNewSession = async (req: Request, userId: string): Promise<string> => {
    try {
        const sessionToken = generateSessionToken();
        req.session.userId = userId;
        req.session.sessionToken = sessionToken;
        return sessionToken;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to create session: ${error.message}`);
        }
        throw error;
    }
}; 