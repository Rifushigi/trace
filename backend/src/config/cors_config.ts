import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: process.env.ENV === 'production'
        ? ['https://your-production-domain.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ['set-cookie']
}