import { Session } from '../models/session_model.js';
import { Types } from 'mongoose';
import crypto from 'crypto';
import { SessionError } from '../middlewares/index.js';

export async function createSession(userId: Types.ObjectId, accessToken: string, refreshToken: string): Promise<string> {
    if (!userId || !accessToken || !refreshToken) {
        throw new SessionError("Invalid session parameters");
    }

    //TODO
    // Validate the userId that is passed
    // Generate a unique device ID
    const deviceId = crypto.randomUUID();

    // Deactivate any existing sessions for this user
    await Session.updateMany(
        { userId, isActive: true },
        { isActive: false }
    );

    // Create new session
    const session = new Session({
        userId,
        deviceId,
        accessToken,
        refreshToken,
        isActive: true
    });

    await session.save();
    return deviceId;
}

export async function validateSession(userId: Types.ObjectId, deviceId: string): Promise<boolean> {
    if (!userId || !deviceId) {
        throw new SessionError("Invalid session parameters");
    }

    const session = await Session.findOne({
        userId,
        deviceId,
        isActive: true
    });

    if (!session) {
        return false;
    }

    // Update last activity
    session.lastActivity = new Date();
    await session.save();

    return true;
}

export async function invalidateSession(userId: Types.ObjectId, deviceId: string): Promise<void> {
    if (!userId || !deviceId) {
        throw new SessionError("Invalid session parameters");
    }

    await Session.updateOne(
        { userId, deviceId },
        { isActive: false }
    );
} 