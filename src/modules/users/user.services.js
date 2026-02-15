import AppError from "../../errorHelpers/AppError.js";
import { Owner, Tenant, User } from "../auth/auth.model.js";


const updateProfile = async (userId, payload) => {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    const newUserData = {};

    if (payload.name) newUserData.name = payload.name;
    if (payload.avatar) newUserData.avatar = payload.avatar;
    await User.findByIdAndUpdate(userId, newUserData);


    if (isUserExist.role === 'tenant') {
        const res = await Tenant.updateOne(
            { user: userId },
            payload
        );
    }

    if (isUserExist.role === 'owner') {
        // Future implementation for owner profile update
        await Owner.updateOne(
            { user: userId },
            payload
        );
    }

    return true
};

const verifyUser = async (userId) => {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }


    await User.findByIdAndUpdate(userId, {
        verified: true
    });
    return true
};
const getProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    if (user.role === 'tenant') {
        const tenantInfo = await Tenant.findOne({ user: userId });
        return { ...user.toObject(), tenantInfo };
    }

    if (user.role === 'owner') {
        const ownerInfo = await Owner.findOne({ user: userId });
        return { ...user.toObject(), tenantInfo: ownerInfo };
    }

    return user;
};

const getAllUsers = async (userId) => {
    const usersWithDocuments = await User.aggregate([
        // Join tenants
        {
            $lookup: {
                from: "tenants",
                localField: "_id",
                foreignField: "user",
                as: "tenantProfile"
            }
        },

        // Join owners
        {
            $lookup: {
                from: "owners",
                localField: "_id",
                foreignField: "user",
                as: "ownerProfile"
            }
        },

        // Flatten arrays (optional)
        {
            $addFields: {
                tenantProfile: { $arrayElemAt: ["$tenantProfile", 0] },
                ownerProfile: { $arrayElemAt: ["$ownerProfile", 0] }
            }
        }
    ]);
    return usersWithDocuments
};
export const UserServices = {
    updateProfile,
    getProfile,
    verifyUser,
    getAllUsers
};