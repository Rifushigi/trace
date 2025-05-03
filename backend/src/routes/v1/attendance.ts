import { Router } from "express";
import {
    sessionMiddleware,
    requireLecturer,
    requireStudent,
    attendanceSessionValidationRules,
    checkInValidationRules,
    sessionIdValidationRules,
    studentClassValidationRules,
    automaticCheckInValidationRules,
    validationErrorHandler
} from "../../middlewares/index.js";
import {
    startSession,
    endSession,
    studentCheckIn,
    getAttendance,
    getStudentAttendanceHistory,
    automaticCheckIn
} from "../../controllers/attendance_controller.js";
import {
    getClassAttendanceReport,
    getStudentAttendanceReport,
    exportAttendanceReport
} from "../../controllers/report_controller.js";

const router = Router();

// Lecturer routes

/**
 * Starts a new attendance session.
 */
router.post("/sessions",
    sessionMiddleware,
    requireLecturer,
    attendanceSessionValidationRules,
    validationErrorHandler,
    startSession
);

/**
 * Ends an ongoing attendance session
 */
router.put("/sessions/:sessionId/end",
    sessionMiddleware,
    requireLecturer,
    sessionIdValidationRules,
    validationErrorHandler,
    endSession
);

// Report routes(Lecturer only)

/** 
 * Generates a detailed attendance report for a specific class
*/
router.get("/classes/:classId/report",
    sessionMiddleware,
    requireLecturer,
    sessionIdValidationRules,
    validationErrorHandler,
    getClassAttendanceReport
);

/**
 * Generates a detailed attendance report for a specific student in a class
 */
router.get("/students/:studentId/classes/:classId/report",
    sessionMiddleware,
    requireLecturer,
    studentClassValidationRules,
    validationErrorHandler,
    getStudentAttendanceReport
);

/**
 * Exports attendance logs for a specific class to a csv file
 */
router.get("/classes/:classId/export",
    sessionMiddleware,
    requireLecturer,
    sessionIdValidationRules,
    validationErrorHandler,
    exportAttendanceReport
);


// Student routes

//TODO
// this should only be allowed if the lecturer allows it, since it bypass the check
// probably using a qr code or only marked by the lecturer
/**
 * Allows a student to check in to an attendance session.
 */
router.post("/check-in",
    sessionMiddleware,
    requireStudent,
    checkInValidationRules,
    validationErrorHandler,
    studentCheckIn
);

// Mixed access routes(Both lecturers and students)

/**
 * Retrieves attendance details for a specific session
 */
router.get("/sessions/:sessionId",
    sessionMiddleware,
    sessionIdValidationRules,
    validationErrorHandler,
    getAttendance
);

/**
 * Retrieves a student's attendance history for a specific class
 */
router.get("/students/:studentId/classes/:classId",
    sessionMiddleware,
    studentClassValidationRules,
    validationErrorHandler,
    getStudentAttendanceHistory
);

// Automatic check-in route (used by ML Service)

/**
 * Handles automatic check-ins, triggered by the external ml service
 */
router.post("/auto-checkin",
    sessionMiddleware,
    automaticCheckInValidationRules,
    validationErrorHandler,
    automaticCheckIn
);

export default router; 