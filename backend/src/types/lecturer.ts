import { Document, ObjectId } from "mongoose";

export interface TLecturer extends Document {
    _id: ObjectId;
    userId: ObjectId;
    staffId: string;
    //TODO need to review this due to the fact that different lecuturers take courses between different departments
    college: string;
}