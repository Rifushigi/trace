import { Router } from "express";
import { getHealth } from "../../controllers/health_controller.js";

const router = Router();

router.get('/', getHealth);

export default router; 