import { asyncErrorHandler } from "../middlewares/index.js";
import { Response } from "express";
import { checkHealth } from "../services/health_service.js";

export const getHealth = asyncErrorHandler(async (_: any, res: Response) => {
    const health = await checkHealth();
    return res.status(health.status === 'ok' ? 200 : 503).json({ response: health });
}); 