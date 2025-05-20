import { Router } from 'express';
import { signUp, updateAvatar, softDelete, restore, getDeleted, getUserProfile, deleteUser } from '../../controllers/user_controller.js';
import { requireAdmin, sessionMiddleware, userSignUpValidationRules, validationErrorHandler } from '../../middlewares/index.js';
import { upload } from '../../config/index.js';

const router = Router();

router.post(
    '/signup',
    userSignUpValidationRules,
    validationErrorHandler,
    signUp
);

router.post(
    '/upload-avatar',
    sessionMiddleware,
    upload.single('avatar'),
    validationErrorHandler,
    updateAvatar
);

router.delete(
    '/soft-delete',
    sessionMiddleware,
    validationErrorHandler,
    softDelete
);

router.delete(
    "/delete",
    sessionMiddleware,
    requireAdmin,
    validationErrorHandler,
    deleteUser
)

router.put(
    '/:id/restore',
    sessionMiddleware,
    validationErrorHandler,
    restore
);

router.get(
    '/deleted',
    sessionMiddleware,
    requireAdmin,
    getDeleted
);

router.get(
    '/profile',
    sessionMiddleware,
    getUserProfile
);

export default router;