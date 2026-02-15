/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.services.js";

const updateProfile = catchAsync(
    async (req, res, next) => {
        const user = await UserServices.updateProfile(req.user.userId, req.body);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User Profile Updated Successfully",
            data: user,
        });
    }
);

const verifyUser = catchAsync(
    async (req, res, next) => {
        const userId = req.body?.user
        const user = await UserServices.verifyUser(userId);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "The user is now verified!",
            data: user,
        });
    }
);
const getProfile = catchAsync(
    async (req, res, next) => {
        const verifiedToken = req.user;

        const user = await UserServices.getProfile(verifiedToken.userId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User fetched Successfully",
            data: user,
        });
    }
);
const getAllUsers = catchAsync(
    async (req, res, next) => {
        const verifiedToken = req.user;

        const users = await UserServices.getAllUsers()

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Users fetched Successfully",
            data: users,
        });
    }
);
export const UserControllers = {
   updateProfile,
   getProfile,
   getAllUsers,
   verifyUser
};