import { IHealthCheckResponse } from "../types/health.js";
import { User } from "../models/user_model.js";
import mongoose from "mongoose";

export async function checkHealth(): Promise<IHealthCheckResponse> {
    const startTime = process.uptime();
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';
    const version = process.env.npm_package_version || '1.0.0';

    // Check database connection
    let databaseStatus = false;
    try {
        // Try to perform a simple query
        await User.findOne().limit(1);
        databaseStatus = true;
    } catch (error) {
        databaseStatus = false;
    }

    // Check if database is connected
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    const services = {
        database: databaseStatus && isDatabaseConnected,
    };

    const status = services.database ? 'ok' : 'error';

    return {
        status,
        timestamp,
        uptime: process.uptime() - startTime,
        environment,
        version,
        services,
    };
} 