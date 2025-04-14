import mongoose, { Document } from "mongoose";
export interface TUser extends Document {
    _id: mongoose.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    role?: 'admin' | 'lecturer' | 'student';
    googleId?: string;
    avatar?: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TUserLoginDTO {
    email: string;
    password: string;
}

export interface TUserCreateDTO {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    googleId?: string;
    email: string;
    password: string;
}

export interface TUserUpdateDTO {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email?: string;
    password?: string;
    updatedAt: Date;
}

export interface TUserDTO {
    _id: mongoose.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email: string;
}
