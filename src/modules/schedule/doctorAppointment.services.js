import { CouponServices } from "../coupon/coupon.services.js";
import { DoctorAppointment } from "./doctorAppointment.model.js";


export const createDoctorAppointment = async (payload, userId) => {
  payload.price = 29
  if (payload?.coupon) {
    const coupon = await CouponServices.getSingleCoupon(payload?.coupon)
    if (coupon) {
      const percentage = coupon.percentage
      let discount = (payload?.price * percentage) / 100
      if (coupon.amount) {
        discount = Math.min(discount, coupon.amount)
      }
      const price = payload.price - discount
      payload = {
        ...payload,
        price
      }
    }
  }
  const appointments = await DoctorAppointment.create({ ...payload, user: userId });
  return appointments;
};

export const getDoctorAppointmentsByPatient = async (userId) => {
  return await DoctorAppointment.find({ user: userId })
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
  return await DoctorAppointment.find({ doctor: userId })
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
