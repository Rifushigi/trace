import { Request, Response } from "express";
import { asyncErrorHandler } from "../middlewares/index.js";
import { TResponseDTO } from "../types/index.js";
import { NotificationPreferences } from "../models/index.js";

export const getPreferences = asyncErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const preferences = await NotificationPreferences.findOne({ userId });

    const response: TResponseDTO = {
        status: true,
        data: preferences || {
            email: {
                sessionStart: true,
                sessionEnd: true,
                checkIn: true,
                anomaly: true,
                lowAttendance: true
            },
            push: {
                sessionStart: true,
                sessionEnd: true,
                checkIn: true,
                anomaly: true,
                lowAttendance: true
            }
        },
        message: "Notification preferences retrieved successfully"
    };

    return res.status(200).json({ response });
});

export const updatePreferences = asyncErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { email, push } = req.body;

    const preferences = await NotificationPreferences.findOneAndUpdate(
        { userId },
        {
            email,
            push,
            updatedAt: new Date()
        },
        { new: true, upsert: true }
    );

    const response: TResponseDTO = {
        status: true,
        data: preferences,
        message: "Notification preferences updated successfully"
    };

    return res.status(200).json({ response });
});

export const resetPreferences = asyncErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const preferences = await NotificationPreferences.findOneAndUpdate(
        { userId },
        {
            email: {
                sessionStart: true,
                sessionEnd: true,
                checkIn: true,
                anomaly: true,
                lowAttendance: true
            },
            push: {
                sessionStart: true,
                sessionEnd: true,
                checkIn: true,
                anomaly: true,
                lowAttendance: true
            },
            updatedAt: new Date()
        },
        { new: true, upsert: true }
    );

    const response: TResponseDTO = {
        status: true,
        data: preferences,
        message: "Notification preferences reset to default"
    };

    return res.status(200).json({ response });
}); 