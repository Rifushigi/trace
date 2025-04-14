import { Document, ObjectId } from "mongoose";

export interface TEnrollment extends Document {
    _id: ObjectId;
    studentId: ObjectId;
    classId: ObjectId;
    enrolledAt: Date;
}