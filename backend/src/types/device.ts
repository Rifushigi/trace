import { ObjectId } from "mongoose";

export interface TDevice {
    deviceType: string;
    serialNumber: string;
    locationDesc: string;
    lastActive: Date;
    assignedClass: ObjectId;
}