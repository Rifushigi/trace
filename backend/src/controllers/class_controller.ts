import { Request, Response } from "express";
import { asyncErrorHandler } from "../middlewares/index.js";
import {
    TResponseDTO,
    AuthenticatedRequest,
    ClassCreateDTO,
    ClassUpdateDTO,
    ClassSearchDTO
} from "../types/index.js";
import {
    createClass,
    updateClass,
    deleteClass,
    getClassById,
    getClassesByLecturer,
    getStudentsInClass,
    enrollStudentInClass,
    getClassSchedule,
    getClassStatistics,
    searchClasses
} from "../services/class_service.js";

export const createNewClass = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const classData: ClassCreateDTO = {
        ...req.body,
        lecturerId: req.user.id
    };
    const newClass = await createClass(classData);

    const response: TResponseDTO = {
        status: true,
        data: newClass,
        message: "Class created successfully"
    };

    return res.status(201).json({ response });
});

export const updateExistingClass = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const updateData: ClassUpdateDTO = req.body;
    const updatedClass = await updateClass(classId, updateData);

    const response: TResponseDTO = {
        status: true,
        data: updatedClass,
        message: "Class updated successfully"
    };

    return res.status(200).json({ response });
});

export const removeClass = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    await deleteClass(classId);

    const response: TResponseDTO = {
        status: true,
        message: "Class deleted successfully"
    };

    return res.status(200).json({ response });
});

export const getClass = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const classData = await getClassById(classId);

    const response: TResponseDTO = {
        status: true,
        data: classData,
        message: "Class retrieved successfully"
    };

    return res.status(200).json({ response });
});

export const getLecturerClasses = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const classes = await getClassesByLecturer(req.user.id);

    const response: TResponseDTO = {
        status: true,
        data: classes,
        message: "Lecturer's classes retrieved successfully"
    };

    return res.status(200).json({ response });
});

export const getClassStudents = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const students = await getStudentsInClass(classId);

    const response: TResponseDTO = {
        status: true,
        data: students,
        message: "Class students retrieved successfully"
    };

    return res.status(200).json({ response });
});

export const enrollStudent = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId, studentId } = req.params;
    await enrollStudentInClass(studentId, classId);

    const response: TResponseDTO = {
        status: true,
        message: "Student enrolled successfully"
    };

    return res.status(201).json({ response });
});

export const getSchedule = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const schedule = await getClassSchedule(classId);

    const response: TResponseDTO = {
        status: true,
        data: schedule,
        message: "Class schedule retrieved successfully"
    };

    return res.status(200).json({ response });
});

export const getStatistics = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const statistics = await getClassStatistics(classId);

    const response: TResponseDTO = {
        status: true,
        data: statistics,
        message: "Class statistics retrieved successfully"
    };

    return res.status(200).json({ response });
});

export const search = asyncErrorHandler(async (req: Request, res: Response) => {
    const searchParams: ClassSearchDTO = req.query;
    const classes = await searchClasses(searchParams);

    const response: TResponseDTO = {
        status: true,
        data: classes,
        message: "Classes retrieved successfully"
    };

    return res.status(200).json({ response });
}); 