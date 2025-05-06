import { Document, ObjectId } from "mongoose";

export interface IEnrollment extends Document {
    _id: ObjectId;
    studentId: ObjectId;
    classId: ObjectId;
    enrolledAt: Date;
}