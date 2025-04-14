import mongoose, { model, Schema } from "mongoose";
import { TVerification } from "../types/index.js";

const verificationSchema = new Schema<TVerification>({
    userId: { type: mongoose.Types.ObjectId, required: true },
    email: { type: String, required: true },
    otp: {
        code: { type: String, default: null },
        createdAt: { type: Date, default: null },
        expiresAt: { type: Date, default: null },
        usedAt: { type: Date, default: null }
    },
    verificationToken: {
        token: { type: String, default: null },
        createdAt: { type: Date, default: null },
        expiresAt: { type: Date, default: null }
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() }
});

export const Verification = model<TVerification>("Verification", verificationSchema);
