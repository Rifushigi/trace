import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: process.env.ENV === 'production'
        ? ['https://your-production-domain.com']
        : true, // Add your development URLs
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
    maxAge: 86400 // 24 hours
}