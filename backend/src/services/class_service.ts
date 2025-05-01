import { Class, Enrollment, AttendanceSession, AttendanceLog } from "../models";
import { TClass, TUser, TAttendanceSession } from "../types";
import { DatabaseError, NotFoundError, ConflictError, ValidationError } from "../middlewares/error_handler.js";
import mongoose, { Schema } from "mongoose";
import { ClassUpdateDTO } from "../types/class.js";

// Basic CRUD Operations
export const createClass = async (classData: {
    title: string;
    courseCode: string;
    lecturerId: string;
    semester: string;
    year: number;
}): Promise<TClass> => {
    try {
        const newClass = await Class.create(classData);
        return newClass;
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new ValidationError("Invalid class data");
        }
        if (error instanceof mongoose.Error) {
            throw new DatabaseError("Failed to create class in database");
        }
        throw error;
    }
};

export const updateClass = async (classId: string, updateData: ClassUpdateDTO): Promise<TClass> => {
    try {
        const updateObj: Partial<TClass> = {
            ...updateData,
            lecturerId: updateData.lecturerId ? new Schema.Types.ObjectId(updateData.lecturerId) : undefined
        };

        const updatedClass = await Class.findByIdAndUpdate(classId, updateObj, { new: true });
        if (!updatedClass) {
            throw new NotFoundError("Class not found");
        }
        return updatedClass;
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new ValidationError("Invalid update data");
        }
        if (error instanceof mongoose.Error) {
            throw new DatabaseError("Failed to update class in database");
        }
        throw error;
    }
};

export const deleteClass = async (classId: string): Promise<boolean> => {
    try {
        const result = await Class.findByIdAndDelete(classId);
        return !!result;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to delete class: ${error.message}`);
        }
        throw error;
    }
};

export const getClassById = async (classId: string): Promise<TClass> => {
    try {
        const classData = await Class.findById(classId);
        if (!classData) {
            throw new NotFoundError("Class not found");
        }
        return classData;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to get class: ${error.message}`);
        }
        throw error;
    }
};

export const getClassesByLecturer = async (lecturerId: string): Promise<TClass[]> => {
    try {
        return await Class.find({ lecturerId });
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to get lecturer's classes: ${error.message}`);
        }
        throw error;
    }
};

export const validateClassExists = async (classId: string): Promise<boolean> => {
    try {
        const classData = await Class.findById(classId);
        return !!classData;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to validate class: ${error.message}`);
        }
        throw error;
    }
};

// Student-Class Integration
export const getStudentsInClass = async (classId: string): Promise<TUser[]> => {
    try {
        const enrollments = await Enrollment.find({ classId })
            .populate<{ studentId: TUser }>('studentId');
        return enrollments.map(e => e.studentId);
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to get students in class: ${error.message}`);
        }
        throw error;
    }
};

export const enrollStudentInClass = async (studentId: string, classId: string): Promise<void> => {
    try {
        const existingEnrollment = await Enrollment.findOne({ studentId, classId });
        if (existingEnrollment) {
            throw new ConflictError("Student is already enrolled in this class");
        }
        await Enrollment.create({ studentId, classId });
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to enroll student: ${error.message}`);
        }
        throw error;
    }
};

// Class Schedule
export const getClassSchedule = async (classId: string): Promise<{
    sessions: TAttendanceSession[];
    nextSession?: TAttendanceSession;
}> => {
    try {
        const sessions = await AttendanceSession.find({ classId })
            .sort({ startTime: -1 });

        const nextSession = sessions.find(s => s.status === "ongoing");

        return {
            sessions,
            nextSession
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to get class schedule: ${error.message}`);
        }
        throw error;
    }
};

// Class Statistics
export const getClassStatistics = async (classId: string): Promise<{
    totalStudents: number;
    totalSessions: number;
    averageAttendance: number;
    attendanceTrend: { date: Date; attendance: number }[];
}> => {
    try {
        const [totalStudents, sessions] = await Promise.all([
            Enrollment.countDocuments({ classId }),
            AttendanceSession.find({ classId })
        ]);

        const sessionIds = sessions.map(s => s._id);
        const logs = await AttendanceLog.find({
            sessionId: { $in: sessionIds }
        });

        const attendanceByDate = logs.reduce((acc, log) => {
            const date = log.checkedInAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const attendanceTrend = Object.entries(attendanceByDate).map(([date, attendance]) => ({
            date: new Date(date),
            attendance
        }));

        return {
            totalStudents,
            totalSessions: sessions.length,
            averageAttendance: sessions.length > 0 ? logs.length / sessions.length : 0,
            attendanceTrend
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to get class statistics: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Searches for classes based on various query parameters.
 * Allows filtering by title, course code, semester, year, or lecturer ID.
 * 
 * @param query - The search criteria for filtering classes.
 * @param query.title - (Optional) The title of the class (partial match, case-insensitive).
 * @param query.courseCode - (Optional) The course code of the class (partial match, case-insensitive).
 * @param query.semester - (Optional) The semester of the class ("Fall", "Spring").
 * @param query.year - (Optional) The year of the class.
 * @param query.lecturerId - (Optional) The ID of the lecturer teaching the class.
 * @returns A list of classes matching the search criteria.
 * @throws DatabaseError - If a database operation fails.
 */
export const searchClasses = async (query: {
    title?: string;
    courseCode?: string;
    semester?: string;
    year?: number;
    lecturerId?: string;
}): Promise<TClass[]> => {
    try {
        const filter: any = {};
        if (query.title) filter.title = new RegExp(query.title, 'i');
        if (query.courseCode) filter.courseCode = new RegExp(query.courseCode, 'i');
        if (query.semester) filter.semester = query.semester;
        if (query.year) filter.year = query.year;
        if (query.lecturerId) filter.lecturerId = query.lecturerId;

        return await Class.find(filter);
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to search classes: ${error.message}`);
        }
        throw error;
    }
}; 