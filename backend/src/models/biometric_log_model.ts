import mongoose, { Schema, model } from "mongoose";
import { TBiometricLog } from "../types/index.js";

const biometricLogSchema = new Schema<TBiometricLog>({
    studentId: { type: mongoose.Types.ObjectId, required: true },
    imagePath: { type: String, required: true },
    embeddingVector: { type: [Number], required: true },
    capturedAt: { type: Date, required: true },
    verified: { type: Boolean, default: false }
});

export const BiometricLog = model<TBiometricLog>("BiometricLog", biometricLogSchema);