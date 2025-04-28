import { ObjectId } from "mongoose";

export interface TAttendanceLog extends Document{
    _id: ObjectId;
    sessionId: ObjectId;
    studentId: ObjectId;
    checkedInAt: Date;
    method: 'face' | 'nfc' | 'ble' | 'geofence';
    confidenceScore: number;
    isAnomaly: boolean;
}