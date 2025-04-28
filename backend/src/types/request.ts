import { Request } from "express";
import { TUser } from "./user.js";

export interface AuthenticatedRequest extends Request {
    user: TUser;
} 