import { ObjectId } from "mongoose";

export interface TAttendanceSession extends Document {
    _id: ObjectId;
    classId: ObjectId;
    startTime: Date;
    endTime: Date;
    status: 'ongoing' | 'completed';
}