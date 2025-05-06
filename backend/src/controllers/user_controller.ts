import { Request, Response } from "express"
import { asyncErrorHandler, NotFoundError } from "../middlewares/index.js"
import { create, uploadAvatar, softDeleteUser, restoreUser, getDeletedUsers, getProfile, hardDeleteUser } from "../services/user_service.js"
import { IAuthenticatedRequest, IResponseDTO, IUserProfileResponseDTO } from "../types/index.js";

export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
    await create(req.body);

    const response: IResponseDTO = {
        status: true,
        message: "Successfully created user"
    }

    return res.status(201).json({ response });
})

export const updateAvatar = asyncErrorHandler(async (req: IAuthenticatedRequest, res: Response) => {
    const { file } = req;

    if (!file) {
        throw new NotFoundError("Avatar image is absent");
    }

    await uploadAvatar(file, req.user._id.toString());

    const response: IResponseDTO = {
        status: true,
        message: "Successfully uploaded user avatar"
    }

    return res.status(201).json({ response });
});

export const softDelete = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id, password } = req.body;
    const result = await softDeleteUser(id, password);

    const response: IResponseDTO = {
        status: result,
        message: "User soft-deleted successfully"
    };

    return res.status(200).json({ response });
});

export const deleteUser = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.body;
    const user = await hardDeleteUser(id);

    const response: IResponseDTO = {
        status: user,
        message: "User hard-deleted successfully"
    }

    return res.status(200).json({ response });
})

export const restore = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await restoreUser(id);

    const response: IResponseDTO = {
        status: result,
        message: "User restored successfully"
    };

    return res.status(200).json({ response });
});

export const getDeleted = asyncErrorHandler(async (_req: Request, res: Response) => {
    const users = await getDeletedUsers();

    const response: IResponseDTO = {
        status: true,
        data: users,
        message: "Deleted users retrieved successfully"
    };

    return res.status(200).json({ response });
});

export const getUserProfile = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getProfile(id);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const responseData: IUserProfileResponseDTO = {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
    }

    const response: IResponseDTO = {
        status: true,
        data: responseData,
        message: "User profile retrieved successfully",
    };

    return res.status(200).json({ response });
});