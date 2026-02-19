import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { DoctorAppointmentServices } from "./doctorAppointment.services.js";

const createDoctorAppointment = catchAsync(async (req, res) => {
    const { userId } = req.user
    const appointments = await DoctorAppointmentServices.createDoctorAppointment(req.body, userId);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Appointments fetched successfully",
        data: appointments
    });
});

const getDoctorAppointmentByPatient = catchAsync(async (req, res) => {
    const { userId } = req.user
    const appointments = await DoctorAppointmentServices.getDoctorAppointmentsByPatient(userId);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Appointments fetched successfully",
        data: appointments
    });
});
const getDoctorAppointmentByDoctor = catchAsync(async (req, res) => {
    const { userId } = req.user
    const appointments = await DoctorAppointmentServices.getDoctorAppointmentsByDoctor(userId);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Appointments fetched successfully",
        data: appointments
    });
});

const deleteDoctorAppointment = catchAsync(async (req, res) => {
    const { id } = req.params
    const appointments = await DoctorAppointmentServices.deleteDoctorAppointments(id);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Appointment is deleted successfully",
        data: appointments
    });
});

export const DoctoAppointControllers = {
    createDoctorAppointment,
    getDoctorAppointmentByDoctor,
    getDoctorAppointmentByPatient,
    deleteDoctorAppointment
};
