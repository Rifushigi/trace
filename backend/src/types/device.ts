import { Document, ObjectId } from "mongoose";

export interface TDevice extends Document {
    _id: ObjectId;
    deviceType: 'nfc' | 'ble' | 'geofence';
    serialNumber: string;
    locationDesc: string;
    lastActive: Date;
    assignedClass: ObjectId;
}