import { ObjectId } from "mongoose";

export interface IAttendanceSession extends Document {
    _id: ObjectId;
    classId: ObjectId;
    startTime: Date;
    endTime: Date;
    status: "ongoing" | "completed";
}