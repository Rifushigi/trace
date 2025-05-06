import mongoose, { model, Schema } from "mongoose";
import { IEnrollment } from "../types/index.js"

const enrollmentSchema = new Schema<IEnrollment>({
    studentId: { type: mongoose.Types.ObjectId, required: true },
    classId: { type: mongoose.Types.ObjectId, required: true },
    enrolledAt: { type: Date, default: Date.now() }
});

export const Enrollment = model<IEnrollment>("Enrollments", enrollmentSchema);