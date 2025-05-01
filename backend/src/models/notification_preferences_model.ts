import mongoose from "mongoose";

const notificationPreferencesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        sessionStart: { type: Boolean, default: true },
        sessionEnd: { type: Boolean, default: true },
        checkIn: { type: Boolean, default: true },
        anomaly: { type: Boolean, default: true },
        lowAttendance: { type: Boolean, default: true }
    },
    push: {
        sessionStart: { type: Boolean, default: true },
        sessionEnd: { type: Boolean, default: true },
        checkIn: { type: Boolean, default: true },
        anomaly: { type: Boolean, default: true },
        lowAttendance: { type: Boolean, default: true }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const NotificationPreferences = mongoose.model("NotificationPreferences", notificationPreferencesSchema); 