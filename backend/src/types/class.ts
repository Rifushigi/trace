import { Document, ObjectId } from "mongoose";
import { TAttendanceSession } from "./attendance_session.js";

export interface TClass extends Document {
    _id: ObjectId;
    title: string;
    courseCode: string;
    className: string;
    lecturerId: ObjectId;
    semester: string;
    year: number;
}

export interface ClassCreateDTO {
    title: string;
    className: string;
    courseCode: string;
    lecturerId: string;
    semester: string;
    year: number;
}

export interface ClassUpdateDTO extends Partial<ClassCreateDTO> { }

export interface ClassSearchDTO {
    title?: string;
    courseCode?: string;
    className?: string;
    semester?: string;
    year?: number;
    lecturerId?: string;
}

export interface ClassScheduleDTO {
    sessions: TAttendanceSession[];
    nextSession?: TAttendanceSession;
}

export interface ClassStatisticsDTO {
    totalStudents: number;
    totalSessions: number;
    averageAttendance: number;
    attendanceTrend: { date: Date; attendance: number }[];
}