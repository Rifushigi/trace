import type { IAttendanceLog } from "../types/index.js";
import mongoose, { model, Schema } from "mongoose";

const attendanceLogSchema = new Schema<IAttendanceLog>({
    sessionId: { type: mongoose.Types.ObjectId, required: true },
    studentId: { type: mongoose.Types.ObjectId, required: true },
    checkedInAt: { type: Date, default: null },
    method: { type: String, enum: ["face", "nfc", "ble", "geofence"], required: true },
    confidenceScore: { type: Number, min: 0, max: 1, required: true },
    isAnomaly: { type: Boolean, default: false }
});

export const AttendanceLog = model<IAttendanceLog>("AttendanceLog", attendanceLogSchema);