import mongoose, { Document } from "mongoose";
export interface TUser extends Document {
    _id: mongoose.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    role: 'admin' | 'lecturer' | 'student';
    isVerified: boolean;
    googleId?: string;
    avatar?: string;
    fcmToken?: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export type TUserUpdateDTO = {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email?: string;
    password?: string;
    role?: "admin" | "lecturer" | "student";
    isVerified?: boolean;
    updatedAt: Date;
} | Partial<TStudentCreateDTO> | Partial<TLecturerCreateDTO>

export interface TUserDTO {
    _id: mongoose.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email: string;
    role: "admin" | "lecturer" | "student";
    isVerified: boolean;
}

type TBaseUserCreateDTO = {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    googleId?: string;
    email: string;
    password: string;
    isVerified?: boolean;
};

export type TAdminCreateDTO = TBaseUserCreateDTO & {
    role: "admin";
};

export type TStudentCreateDTO = TBaseUserCreateDTO & {
    role: "student";
    matricNo: string;
    program: string;
    level: string;
    faceModelId?: string;
    nfcUid?: string;
    bleToken?: string;
};

export type TLecturerCreateDTO = TBaseUserCreateDTO & {
    role: "lecturer";
    staffId: string;
    college: string;
};

export type TUserCreateDTO =
    | TAdminCreateDTO
    | TStudentCreateDTO
    | TLecturerCreateDTO;