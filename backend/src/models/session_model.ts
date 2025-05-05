import { Schema, model, Document } from 'mongoose';
import { ISession } from '../types/session.js';

export interface ISessionDocument extends ISession, Document { }

const sessionSchema = new Schema<ISessionDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        deviceId: {
            type: String,
            required: true,
            unique: true
        },
        accessToken: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastActivity: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
sessionSchema.index({ isActive: 1 });

export const Session = model<ISessionDocument>('Session', sessionSchema); 