import { DoctorAppointment } from "./doctorAppointment.model.js";


export const createDoctorAppointment = async (payload, userId) => {
  const appointments = await DoctorAppointment.create({ ...payload, user: userId });
  return appointments;
};

export const getDoctorAppointmentsByPatient = async (userId) => {
  return await DoctorAppointment.find({user: userId})
    .populate("doctor", "name avatar")
    .populate("category", "name")
    .populate("user", "name avatar")
    .sort({ createdDate: -1 });
};

export const getAllDoctorAppointments = async () => {
  return await DoctorAppointment.find()
    .populate("doctor", "name avatar")
    .populate("category", "name")
    .populate("user", "name avatar")
    .sort({ createdDate: -1 });
};

export const getDoctorAppointmentsByDoctor = async (userId) => {
  return await DoctorAppointment.find({doctor: userId})
    .populate("doctor", "name avatar")
    .populate("category", "name")
    .populate("user", "name avatar")
    .sort({ createdDate: -1 });
};
export const deleteDoctorAppointments = async (id) => {
  return await DoctorAppointment.findByIdAndDelete(id)
};

export const DoctorAppointmentServices = {
  createDoctorAppointment,
  getDoctorAppointmentsByDoctor,
  getDoctorAppointmentsByPatient,
  deleteDoctorAppointments,
  getAllDoctorAppointments
}
