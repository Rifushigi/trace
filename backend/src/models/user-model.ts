import type { TUser } from "../types/index.js";
import { model, Schema } from "mongoose";

const userSchema = new Schema<TUser>({
    avatar: { type: String },
    email: { type: String, required: true },
    firstName: { type: String },
    role: { type: String, enum: ['admin', 'lecturer', 'student'], required: true },
    googleId: { type: String },
    lastName: { type: String },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

export const User = model<TUser>("User", userSchema)