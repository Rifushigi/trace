import 'express-session'

declare module 'express-session' {
    interface SessionData {
        userId: string;
        refreshToken: { token: string, createdAt: Date };
    }
}
