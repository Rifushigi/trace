import mongoose, { Schema, model } from "mongoose";
import { ILecturer } from "../types/index.js";

const lecturerSchema = new Schema<ILecturer>({
    userId: { type: mongoose.Types.ObjectId, required: true },
    staffId: { type: String, required: true, unique: true },
    college: { type: String, required: true }
});

export const Lecturer = model<ILecturer>("Lecturers", lecturerSchema);