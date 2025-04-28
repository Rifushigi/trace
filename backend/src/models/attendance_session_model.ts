import mongoose, { model, Schema } from "mongoose";
import { TAttendanceSession } from "../types/index.js"

const attendanceSessionSchema = new Schema<TAttendanceSession>({
    classId: { type: mongoose.Types.ObjectId, required: true },
    startTime: {type: Date, default: null},
    endTime: {type: Date, default: null},
    status: {type: String, enum:["ongoing", "completed"]}
});

export const AttendanceSession = model<TAttendanceSession>("AttendanceSession", attendanceSessionSchema);