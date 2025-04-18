import { User } from "../models";
import type { TUser, TUserCreateDTO, TUserDTO, TUserUpdateDTO } from "../types"
import { AppError, ConflictError, DatabaseError, NotFoundError, UnauthorizedError } from "../middlewares";
import { comparePayload, hashPayload } from "../common";
import { Model } from "mongoose";
import { cldnDir, cloudinary } from '../config';
import { getAvatarHostname, getAvatarPublicId } from "../common";
import { Readable } from "stream";

const dbModel: Model<TUser> = User;

export async function create(userDTO: TUserCreateDTO): Promise<boolean> {
    const emailExists = await getUserByEmail(userDTO.email);
    if (emailExists) throw new ConflictError("Email already exists");
    userDTO.password = await hashPayload(userDTO.password);
    const newUser = new dbModel(userDTO);
    if (await newUser.save()) return true;
    throw new Error("Failed to save user");
}

export async function getUserById(id: string): Promise<TUser | null> {
    const user = await dbModel.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
}

export async function getUserByEmail(email: string): Promise<TUser | null> {
    return dbModel.findOne({ email });
}

export async function deleteUser(id: string, password: string): Promise<boolean> {
    const user = await getUserById(id);
    if (!user?.password) throw new ConflictError("User has not created a password");
    if (await comparePayload(password, user.password)) {
        const result = await dbModel.findByIdAndDelete(id);
        return !!result;
    }
    throw new UnauthorizedError("Failed to delete user");
}

export async function getProfile(id: string): Promise<TUserDTO | null> {
    return await getUserById(id);
}

export async function update(id: string, updateDTO: TUserUpdateDTO,): Promise<TUserUpdateDTO | null> {
    try {
        return await dbModel.findByIdAndUpdate(id, updateDTO, { new: true });
    } catch (err: any) {
        throw new DatabaseError("failed to update user", err.message)
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