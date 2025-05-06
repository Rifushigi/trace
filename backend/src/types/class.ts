import { Document, ObjectId } from "mongoose";
import { IAttendanceSession } from "./attendance_session.js";

export interface IClass extends Document {
    _id: ObjectId;
    title: string;
    courseCode: string;
    className: string;
    lecturerId: ObjectId;
    semester: string;
    year: number;
}

export interface IClassCreateDTO {
    title: string;
    className: string;
    courseCode: string;
    lecturerId: string;
    semester: string;
    year: number;
}

export interface IClassUpdateDTO extends Partial<IClassCreateDTO> { }

export interface IClassSearchDTO {
    title?: string;
    courseCode?: string;
    className?: string;
    semester?: string;
    year?: number;
    lecturerId?: string;
}

export interface IClassScheduleDTO {
    sessions: IAttendanceSession[];
    nextSession?: IAttendanceSession;
}

export interface IClassStatisticsDTO {
    totalStudents: number;
    totalSessions: number;
    averageAttendance: number;
    attendanceTrend: { date: Date; attendance: number }[];
}