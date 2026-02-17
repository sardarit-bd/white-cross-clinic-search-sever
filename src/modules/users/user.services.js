import AppError from "../../errorHelpers/AppError.js";
import { Doctor, Patient, User } from "../auth/auth.model.js";


const updateProfile = async (userId, payload) => {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    const newUserData = {};

    if (payload.name) newUserData.name = payload.name;
    if (payload.avatar) newUserData.avatar = payload.avatar;
    await User.findByIdAndUpdate(userId, newUserData);


    if (isUserExist.role === 'doctor') {
        const res = await Doctor.updateOne(
            { user: userId },
            payload
        );
    }

    if (isUserExist.role === 'patient') {
        // Future implementation for owner profile update
        await Patient.updateOne(
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

    if (user.role === 'doctor') {
        const doctorInfo = await Doctor.findOne({ user: userId });
        return { ...user.toObject(),  doctorInfo};
    }

    if (user.role === 'patient') {
        const patientInfo = await Patient.findOne({ user: userId });
        return { ...user.toObject(), patientInfo };
    }

    return user;
};

const getAllUsers = async (userId) => {
    const usersWithDocuments = await User.aggregate([
        // Join tenants
        {
            $lookup: {
                from: "doctors",
                localField: "_id",
                foreignField: "user",
                as: "doctorProfile"
            }
        },

        // Join owners
        {
            $lookup: {
                from: "patients",
                localField: "_id",
                foreignField: "user",
                as: "patientProfile"
            }
        },

        // Flatten arrays (optional)
        {
            $addFields: {
                doctorProfile: { $arrayElemAt: ["$doctorProfile", 0] },
                patientProfile: { $arrayElemAt: ["$patientProfile", 0] }
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