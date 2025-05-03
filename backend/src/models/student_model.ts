import mongoose, { model, Schema } from "mongoose";
import { TStudent } from "../types/index.js";

const studentSchema = new Schema<TStudent>({
    userId: { type: mongoose.Types.ObjectId, required: true },
    matricNo: { type: String, required: true, unique: true },
    program: { type: String, required: true },
    level: { type: String, enum: ["100", "200", "300", "400", "500", "600", "700"], required: true },
    faceModelId: { type: String },
    nfcUid: { type: String },
    bleToken: { type: String }
});

export const Student = model<TStudent>("Students", studentSchema);