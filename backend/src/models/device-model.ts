import mongoose, { model, Schema } from "mongoose";
import { TDevice } from "../types/index.js";

const deviceSchema = new Schema<TDevice>({
    deviceType: { type: String, enum: ["nfc", "ble", "geofence"], required: true },
    serialNumber: { type: String, required: true },
    locationDesc: { type: String, required: true },
    lastActive: { type: Date, default: null },
    assignedClass: { type: mongoose.Types.ObjectId, required: true }
});

export const Device = model<TDevice>("Device", deviceSchema);