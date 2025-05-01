import mongoose, { model, Schema } from "mongoose";
import { TEnrollment } from "../types/index.js"

const enrollmentSchema = new Schema<TEnrollment>({
    studentId: { type: mongoose.Types.ObjectId, required: true },
    classId: { type: mongoose.Types.ObjectId, required: true },
    enrolledAt: { type: Date, default: Date.now() }
});

export const Enrollment = model<TEnrollment>("Enrollments", enrollmentSchema);