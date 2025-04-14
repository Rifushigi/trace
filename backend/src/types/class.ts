import { Document, ObjectId } from "mongoose";

export interface TClass extends Document {
    _id: ObjectId;
    title: string;
    courseCode: string;
    lecturerId: ObjectId;
    semester: string;
    year: number;
}