import { Lecturer, Student, User } from "../models";
import type { TLecturer, TStudent, TStudentCreateDTO, TUser, TUserCreateDTO, TUserDTO, TUserUpdateDTO, TLecturerCreateDTO } from "../types"
import { AppError, ConflictError, DatabaseError, NotFoundError, UnauthorizedError } from "../middlewares";
import { comparePayload, hashPayload } from "../common";
import { Model } from "mongoose";
import { cldnDir, cloudinary } from '../config';
import { getAvatarHostname, getAvatarPublicId } from "../common";
import { Readable } from "stream";

const userModel: Model<TUser> = User;
const studentModel: Model<TStudent> = Student;
const lecturerModel: Model<TLecturer> = Lecturer;

export async function create(userDTO: TUserCreateDTO): Promise<boolean> {
    const emailExists = await getUserByEmail(userDTO.email);
    if (emailExists) throw new ConflictError("Email already exists");

    // Validate role
    const validRoles = ["admin", "lecturer", "student"];
    if (!validRoles.includes(userDTO.role)) {
        throw new ConflictError("Invalid role");
    }

    // Set default values
    userDTO.isVerified = userDTO.isVerified ?? false;
    userDTO.password = await hashPayload(userDTO.password);

    const newUser = new userModel(userDTO);
    const savedUser = await newUser.save();
    if (!savedUser) throw new Error("Failed to save user");

    // Handle role-specific logic
    if (userDTO.role === "student") {
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
    } else if (userDTO.role === "lecturer") {
        const lecturerData = {
            userId: savedUser._id,
            staffId: userDTO.staffId,
            department: userDTO.department,
        };
        const lecturer = new lecturerModel(lecturerData);
        await lecturer.save();
    }

    return true;
}

export async function getUserById(id: string): Promise<TUser | null> {
    const user = await userModel.findOne({ _id: id, deletedAt: null });
    if (!user) throw new NotFoundError("User not found");
    return user;
}

export async function getUserByEmail(email: string): Promise<TUser | null> {
    return userModel.findOne({ email, deletedAt: null });
}

export async function deleteUser(id: string, password: string): Promise<boolean> {
    const user = await getUserById(id);
    if (!user?.password) throw new ConflictError("User has not created a password");
    if (await comparePayload(password, user.password)) {
        const result = await userModel.findByIdAndDelete(id);
        return !!result;
    }
    throw new UnauthorizedError("Failed to delete user");
}

export async function softDeleteUser(id: string): Promise<boolean> {
    const user = await getUserById(id);
    if (!user) throw new NotFoundError("User not found");

    const result = await userModel.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    return !!result;
}

export async function restoreUser(id: string): Promise<boolean> {
    const user = await getUserById(id);
    if (!user) throw new NotFoundError("User not found");

    const result = await userModel.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
    return !!result;
}

export async function getDeletedUsers(): Promise<TUser[]> {
    return userModel.find({ deletedAt: { $ne: null } });
}

export async function getProfile(id: string): Promise<TUserDTO | null> {
    return await getUserById(id);
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
            const studentData = {...updateDTO};
            await studentModel.findOneAndUpdate({ userId: id }, studentData, { new: true });
        } else if (updateDTO.role === "lecturer") {
            const lecturerData = {...updateDTO};
            await lecturerModel.findOneAndUpdate({ userId: id }, lecturerData, { new: true });
        }

        return updatedUser;
    } catch (err: any) {
        throw new DatabaseError("Failed to update user", err.message);
    }
}

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