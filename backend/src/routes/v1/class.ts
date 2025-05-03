import { Router } from "express";
import {
    sessionMiddleware,
    requireAdmin,
    requireLecturer,
    validationErrorHandler,
    classValidationRules,
    classIdValidationRules,
    studentIdValidationRules,
    searchValidationRules
} from "../../middlewares/index.js";
import {
    createNewClass,
    updateExistingClass,
    removeClass,
    getClass,
    getLecturerClasses,
    getClassStudents,
    enrollStudent,
    getSchedule,
    getStatistics,
    search,
} from "../../controllers/class_controller.js";

const router = Router();

// Admin only routes
router.post("/",
    sessionMiddleware,
    requireAdmin,
    classValidationRules,
    validationErrorHandler,
    createNewClass
);

router.put("/:classId",
    sessionMiddleware,
    requireAdmin,
    classIdValidationRules,
    classValidationRules,
    validationErrorHandler,
    updateExistingClass
);

router.delete("/:classId",
    sessionMiddleware,
    requireAdmin,
    classIdValidationRules,
    validationErrorHandler,
    removeClass
);

// Lecturer/Students routes
router.get("/lecturer",
    sessionMiddleware,
    requireLecturer,
    getLecturerClasses
);

router.get("/:classId",
    sessionMiddleware,
    classIdValidationRules,
    validationErrorHandler,
    getClass
);

router.get("/:classId/students",
    sessionMiddleware,
    requireLecturer,
    classIdValidationRules,
    validationErrorHandler,
    getClassStudents
);

router.post("/:classId/students/:studentId",
    sessionMiddleware,
    requireLecturer,
    classIdValidationRules,
    studentIdValidationRules,
    validationErrorHandler,
    enrollStudent
);

router.get("/:classId/schedule",
    sessionMiddleware,
    classIdValidationRules,
    validationErrorHandler,
    getSchedule
);

router.get("/:classId/statistics",
    sessionMiddleware,
    requireLecturer,
    classIdValidationRules,
    validationErrorHandler,
    getStatistics
);

router.get("/search",
    sessionMiddleware,
    searchValidationRules,
    validationErrorHandler,
    search
);

export default router; 