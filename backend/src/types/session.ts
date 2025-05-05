import { Types } from 'mongoose';

export interface ISession {
    userId: Types.ObjectId;
    deviceId: string;
    accessToken: string;
    refreshToken: string;
    isActive: boolean;
    lastActivity?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISessionDTO {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    deviceId: string;
    isActive: boolean;
    lastActivity?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
