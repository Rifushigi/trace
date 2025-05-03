import mongoose, { Schema, model } from "mongoose";
import { TLecturer } from "../types/index.js";

const lecturerSchema = new Schema<TLecturer>({
    userId: { type: mongoose.Types.ObjectId, required: true },
    staffId: { type: String, required: true, unique: true },
    department: { type: String, required: true }
});

export const Lecturer = model<TLecturer>("Lecturers", lecturerSchema);