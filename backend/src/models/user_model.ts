import type { TUser } from "../types/index.js";
import { model, Schema } from "mongoose";

const userSchema = new Schema<TUser>({
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String },
    role: { type: String, required: true, enum: ['admin', 'lecturer', 'student'] },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
    googleId: { type: String },
})

export const User = model<TUser>("User", userSchema)