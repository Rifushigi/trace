import admin from "firebase-admin";
import { User } from "../models/index.js"

class FCMService {
    private static instance: FCMService;

    private constructor() {
        // Initialize Firebase Admin SDK
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
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
            // Store token in your database
            await User.findByIdAndUpdate(userId, { fcmToken: token });
        } catch (error) {
            console.error('Error storing FCM token:', error);
            throw error;
        }
    }

    /**
     * Remove FCM token for a user
     */
    async removeToken(userId: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
        } catch (error) {
            console.error('Error removing FCM token:', error);
            throw error;
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
            if (!user?.fcmToken) {
                console.warn(`No FCM token found for user ${userId}`);
                return;
            }

            await this.sendToToken(user.fcmToken, notification);
        } catch (error) {
            console.error('Error sending notification to user:', error);
            throw error;
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
                console.warn('No FCM tokens found for the specified users');
                return;
            } else {
                await this.sendToTokens(tokens, notification);
            }

        } catch (error) {
            console.error('Error sending notification to users:', error);
            throw error;
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
            console.error('Error sending notification to token:', error);
            throw error;
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
            console.error('Error sending notification to tokens:', error);
            throw error;
        }
    }
}

export const fcmService = FCMService.getInstance(); 