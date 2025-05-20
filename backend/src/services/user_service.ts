import { Lecturer, Student, User } from "../models/index.js";
import {
    ILecturer,
    IStudent,
    IUser,
    TUserCreateDTO,
    IUserDTO,
    TUserUpdateDTO,
    TAdminCreateDTO
} from "../types/index.js"
import {
    AppError,
    ConflictError,
    DatabaseError,
    NotFoundError,
    UnauthorizedError,
    ValidationError
} from "../middlewares/index.js";
import {
    comparePayload,
    hashPayload,
    getAvatarHostname,
    getAvatarPublicId
} from "../utils/index.js";
import { Model } from "mongoose";
import { cldnDir, cloudinary } from '../config/index.js';
import { Readable } from "stream";
import { sendVerificationEmail } from "./email_service.js";

const userModel: Model<IUser> = User;
const studentModel: Model<IStudent> = Student;
const lecturerModel: Model<ILecturer> = Lecturer;

export async function create(userDTO: TUserCreateDTO): Promise<boolean> {
    const emailExists = await getUserByEmail(userDTO.email);
    if (emailExists) throw new ConflictError("Email already exists");

    // Validate role
    const validRoles = ["admin", "lecturer", "student"];
    if (!validRoles.includes(userDTO.role)) {
        throw new ConflictError("Invalid role");
    }

    userDTO.isVerified = userDTO.isVerified ?? false;
    userDTO.password = await hashPayload(userDTO.password);

    // Handle role-specific logic
    if (userDTO.role === "student" && "matricNo" in userDTO && "program" in userDTO && "level" in userDTO) {
        const matricNoExists = await studentModel.findOne({ matricNo: userDTO.matricNo });
        if (matricNoExists) throw new ValidationError("Matric number is already in use")
        const newUser = new userModel(userDTO);
        const savedUser = await newUser.save();
        if (!savedUser) throw new Error("Failed to save user");

        const studentData = {
            userId: savedUser._id,
            matricNo: userDTO.matricNo,
            program: userDTO.program,
            level: userDTO.level,
            faceModelId: userDTO.faceModelId,
            nfcUid: userDTO.nfcUid,
            bleToken: userDTO.bleToken,
        };
        const student = new studentModel(studentData);
        await student.save();
        sendVerificationEmail(userDTO.email);

    } else if (userDTO.role === "lecturer" && "college" in userDTO && "staffId" in userDTO) {
        const staffIdExists = await lecturerModel.findOne({ staffId: userDTO.staffId });
        if (staffIdExists) throw new ValidationError("StaffId is already in use");
        const newUser = new userModel(userDTO);
        const savedUser = await newUser.save();
        if (!savedUser) throw new Error("Failed to save user");

        const lecturerData = {
            userId: savedUser._id,
            staffId: userDTO.staffId,
            college: userDTO.college,
        };
        const lecturer = new lecturerModel(lecturerData);
        await lecturer.save();
        sendVerificationEmail(userDTO.email);
    } else if (userDTO.role === "admin") {
        const newUser = new userModel(userDTO);
        await newUser.save();
        sendVerificationEmail(userDTO.email);
    } else {
        throw new ValidationError("Invalid role or missing required fields");
    }

    return true;
}

export async function getUserById(id: string): Promise<IUser | null> {
    const user = await userModel.findOne({ _id: id, deletedAt: null });
    if (!user) throw new NotFoundError("User not found");
    return user;
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
    return userModel.findOne({ email, deletedAt: null });
}

export async function hardDeleteUser(id: string): Promise<boolean> {
    const user = await getUserById(id);

    if (user!.role === "student") {
        const isUserDeleted = await userModel.findByIdAndDelete(id);
        const isStudentDeleted = await studentModel.findOneAndDelete({ userId: id })
        return !!isUserDeleted && !!isStudentDeleted;
    }

    if (user!.role === "lecturer") {
        const isUserDeleted = await userModel.findByIdAndDelete(id);
        const isLecturerDeleted = await lecturerModel.findOneAndDelete({ userId: id })
        return !!isUserDeleted && !!isLecturerDeleted;
    }

    throw new UnauthorizedError("Failed to hard-delete user");
}

export async function softDeleteUser(id: string, password: string): Promise<boolean> {
    const user = await getUserById(id);
    if (!user?.password) throw new ConflictError("User has not created a password");
    if (!user) throw new NotFoundError("User not found");

    if (await comparePayload(password, user.password)) {
        const result = await userModel.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
        return !!result;
    }

    throw new UnauthorizedError("Failed to soft delete user");
}

export async function restoreUser(id: string): Promise<boolean> {
    const user = await getUserById(id);
    if (!user) throw new NotFoundError("User not found");

    const result = await userModel.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
    return !!result;
}

export async function getDeletedUsers(): Promise<IUser[]> {
    return userModel.find({ deletedAt: { $ne: null } });
}

export async function getProfile(id: string): Promise<IUserDTO | null> {
    const user = await getUserById(id);
    if (!user) return null;

    let additionalInfo = {};

    if (user.role === 'student') {
        const student = await studentModel.findOne({ userId: user._id });
        if (student) {
            additionalInfo = {
                matricNo: student.matricNo,
                program: student.program,
                level: student.level,
            };
        }
    } else if (user.role === 'lecturer') {
        const lecturer = await lecturerModel.findOne({ userId: user._id });
        if (lecturer) {
            additionalInfo = {
                staffId: lecturer.staffId,
                college: lecturer.college,
            };
        }
    }

    return {
        ...user.toObject(),
        ...additionalInfo
    };
}

export async function update(id: string, updateDTO: TUserUpdateDTO): Promise<TUserUpdateDTO | null> {
    try {
        // Validate role if being updated
        if (updateDTO.role) {
            const validRoles = ["admin", "lecturer", "student"];
            if (!validRoles.includes(updateDTO.role)) {
                throw new ConflictError("Invalid role");
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, updateDTO, { new: true });
        if (!updatedUser) throw new NotFoundError("User not found");

        // Handle role-specific updates
        if (updateDTO.role === "student") {
            const studentData = { ...updateDTO };
            await studentModel.findOneAndUpdate({ userId: id }, studentData, { new: true });
        } else if (updateDTO.role === "lecturer") {
            const lecturerData = { ...updateDTO };
            await lecturerModel.findOneAndUpdate({ userId: id }, lecturerData, { new: true });
        }

        return updatedUser;
    } catch (err: any) {
        throw new DatabaseError("Failed to update user", err.message);
    }
}

// avatar upload logic

// prevent multiple uploads by keeping track of the upload state
const uploadLocks: { [userId: string]: boolean } = {}

export const uploadAvatar = async (file: Express.Multer.File, userId: string): Promise<void> => {
    if (uploadLocks[userId]) {
        throw new AppError(429, "File upload is processing, please try again later")
    }
    try {
        const user = await getUserById(userId);
        uploadLocks[userId] = true;
        if (user?.avatar && getAvatarHostname(user.avatar)) {
            await cloudinary.uploader.destroy(getAvatarPublicId(user.avatar));
        }
        const transformations = {
            format: 'png',
            public_id: `${crypto.randomUUID()}-${Date.now()}`,
            asset_folder: cldnDir
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            transformations,
            async (_err, result) => {
                if (result) {
                    const optimisedUrl = cloudinary.url(
                        result.public_id,
                        { fetch_format: "auto", quality: "auto", radius: "max", aspect_ratio: "1:1", crop: "auto" }
                    );

                    const updateObj = { avatar: optimisedUrl, updatedAt: new Date() };
                    await update(userId, updateObj);
                }
            });

        const stream = Readable.from(Buffer.from(file.buffer));
        stream.pipe(uploadStream);

    } catch (err: any) {
        throw new AppError(500, "failed to upload avatar", true, err.message);
    } finally {
        setTimeout(() => delete uploadLocks[userId], 5000);
    }
}

export async function createDefaultAdmin(): Promise<void> {
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@trace.com';
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

    try {
        const existingAdmin = await getUserByEmail(defaultAdminEmail);
        if (existingAdmin) {
            console.log('Default admin user already exists');
            return;
        }

        const adminData: TAdminCreateDTO = {
            email: defaultAdminEmail,
            password: defaultAdminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isVerified: true
        };

        await create(adminData);
        console.log('Default admin user created successfully');
    } catch (error) {
        console.error('Failed to create default admin user:', error);
    }
}