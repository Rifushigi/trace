import mongoose, { model, Schema } from "mongoose";
import { IClass } from "../types/index.js";

const classSchema = new Schema<IClass>({
    title: { type: String, required: true },
    className: { type: String, required: true },
    courseCode: { type: String, required: true },
    lecturerId: { type: mongoose.Types.ObjectId, required: true },
    semester: { type: String, required: true },
    year: { type: Number, required: true },
    beaconIds: [{ type: String, required: true }], // BLE beacon IDs for geofencing
});

export const Class = model<IClass>("Class", classSchema);