import { Document, ObjectId } from "mongoose";

export interface TLecturer extends Document {
    _id: ObjectId;
    userId: ObjectId;
    staffId: string;
    department: string;
}