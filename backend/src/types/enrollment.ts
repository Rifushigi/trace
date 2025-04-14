import { Document, ObjectId } from "mongoose";

export interface TEnrollment extends Document {
    id: ObjectId;
    studentId: ObjectId;
    classId: ObjectId;
    enrolledAt: Date;
}