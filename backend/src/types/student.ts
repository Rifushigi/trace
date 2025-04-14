import { Document, ObjectId } from "mongoose"

export interface TStudent extends Document {
    _id: ObjectId;
    userId: ObjectId;
    matricNo: string;
    program: string;
    level: string;
    //TODO need to confirm if these fields should be required
    faceModelId: string;  // ML embedding ref
    nfcUid: string;
    bleToken: string;
}