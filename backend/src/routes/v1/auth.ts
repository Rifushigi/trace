import { Router } from "express";
import { sessionMiddleware, validationErrorHandler, userSignInValidationRules } from "../../middlewares";
import { refreshToken, sendEmail, sendOtp, signIn, signout, verifyEmail, verifyOtp } from "../../controllers/auth_controller.js";

const router = Router();

router.post('/signin', userSignInValidationRules, validationErrorHandler, signIn);
router.get('/refresh-token', refreshToken);
router.post('/signout', sessionMiddleware, signout);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/send-verification-email', sendEmail);
router.get('/verify-email', verifyEmail);

export default router;