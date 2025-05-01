import { Router } from "express";
import { sessionMiddleware } from "../../middlewares";
import {
    getPreferences,
    updatePreferences,
    resetPreferences
} from "../../controllers/notification_preferences_controller.js";

const router = Router();

// Get notification preferences
router.get("/preferences/:userId", sessionMiddleware, getPreferences);

// Update notification preferences
router.put("/preferences/:userId", sessionMiddleware, updatePreferences);

// Reset notification preferences to default
router.post("/preferences/:userId/reset", sessionMiddleware, resetPreferences);

export default router; 