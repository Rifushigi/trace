import admin from "firebase-admin";
import { User } from "../models/index.js"
import {
    AppError,
    NotFoundError,
    DatabaseError
} from "../middlewares/error_handler.js";
import { firebaseClientEmail, firebasePrivateKey, firebaseProjectId } from "../config/index.js";

class FCMService {
    private static instance: FCMService;

    private constructor() {
        if (!admin.apps.length) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: firebaseProjectId,
                        clientEmail: firebaseClientEmail,
                        privateKey: firebasePrivateKey?.replace(/\\n/g, '\n'),
                    }),
                });
            } catch (error) {
                throw new AppError(500, "Failed to initialize Firebase Admin SDK", true, error);
            }
        }
    }

    public static getInstance(): FCMService {
        if (!FCMService.instance) {
            FCMService.instance = new FCMService();
        }
        return FCMService.instance;
    }

    /**
     * Store FCM token for a user
     */
    async storeToken(userId: string, token: string): Promise<void> {
        try {
            const user = await User.findByIdAndUpdate(userId, { fcmToken: token });
            if (!user) {
                throw new NotFoundError(`User not found for storing FCM token: ${userId}`);
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError('Error storing FCM token', error);
        }
    }

    /**
     * Remove FCM token for a user
     */
    async removeToken(userId: string): Promise<void> {
        try {
            const user = await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
            if (!user) {
                throw new NotFoundError(`User not found for removing FCM token: ${userId}`);
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new DatabaseError('Error removing FCM token', error);
        }
    }

    /**
     * Send notification to a specific user
     */
    async sendToUser(userId: string, notification: {
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<void> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new NotFoundError(`User not found: ${userId}`);
            }
            if (!user.fcmToken) {
                throw new NotFoundError(`No FCM token found for user ${userId}`);
            }
            await this.sendToToken(user.fcmToken, notification);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Error sending notification to user', true, error);
        }
    }

    /**
     * Send notification to multiple users
     */
    async sendToUsers(userIds: string[] | string, notification: {
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<void> {
        try {
            const users = await User.find({ _id: { $in: userIds } });

            const tokens = users
                .filter((user): user is typeof user & { fcmToken: string } =>
                    typeof user.fcmToken === 'string' && user.fcmToken.length > 0
                )
                .map(user => user.fcmToken);

            if (tokens.length === 0) {
                throw new NotFoundError('No FCM tokens found for the specified users');
            } else {
                await this.sendToTokens(tokens, notification);
            }

        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Error sending notification to users', true, error);
        }
    }

    /**
     * Send notification to a specific FCM token
     */
    private async sendToToken(token: string, notification: {
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<void> {
        try {
            const message: admin.messaging.Message = {
                token,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data,
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'attendance_channel',
                        priority: 'high',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                        },
                    },
                },
            };

            await admin.messaging().send(message);
        } catch (error) {
            throw new AppError(500, 'Error sending notification to token', true, error);
        }
    }

    /**
     * Send notification to multiple FCM tokens
     */
    private async sendToTokens(tokens: string[], notification: {
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<void> {
        try {
            const messages = tokens.map(token => ({
                token,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data,
                android: {
                    priority: "high" as const,
                    notification: {
                        channelId: 'attendance_channel',
                        priority: "high" as const,
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                        },
                    },
                },
            }));

            await admin.messaging().sendEach(messages);
        } catch (error) {
            throw new AppError(500, 'Error sending notification to tokens', true, error);
        }
    }
}

export const fcmService = FCMService.getInstance();