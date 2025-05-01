import { Router } from 'express';
import { signUp, updateAvatar } from '../../controllers/user_controller.js';
import { sessionMiddleware, userSignUpValidationRules, validationErrorHandler } from '../../middlewares';
import { upload } from '../../config';

const router = Router();

router.post('/signup', userSignUpValidationRules, validationErrorHandler, signUp);
router.post('/upload-avatar', sessionMiddleware, upload.single('avatar'), validationErrorHandler, updateAvatar);

export default router;