import { Request, Response } from "express"
import { asyncErrorHandler, NotFoundError } from "../middlewares"
import { create, uploadAvatar } from "../services/user_service.js"
import { TResponseDTO } from "../types";

export const signUp = asyncErrorHandler(async (req: Request, res: Response) => {
    await create(req.body);

    const response: TResponseDTO = {
        status: true,
        message: "Successfully created user"
    }

    return res.status(201).json({ response });
})

export const updateAvatar = asyncErrorHandler(async (req: Request, res: Response) => {
    const { file } = req;

    if (!file) {
        throw new NotFoundError("Avatar image is absent");
    }

    await uploadAvatar(file, req.session.userId!);

    const response: TResponseDTO = {
        status: true,
        message: "Successfully uploaded user avatar"
    }

    return res.status(201).json({ response });
});