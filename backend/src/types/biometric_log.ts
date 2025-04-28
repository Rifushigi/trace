import { Document, ObjectId } from "mongoose";

export interface TBiometricLog extends Document{
    _id: ObjectId;
    studentId: ObjectId;
    imagePath: string;
    embeddingVector: [number];
    capturedAt: Date;
    verified: boolean;
}