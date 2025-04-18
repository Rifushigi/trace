import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3001", "http://localhost:8081"],
    allowedHeaders: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
    credentials: true,
}