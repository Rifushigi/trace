import { Request } from "express";
import { IUser } from "./user.js";

export interface IAuthenticatedRequest extends Request {
    user: IUser;
    role?: string;
} 