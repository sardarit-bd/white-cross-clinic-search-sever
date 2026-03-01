import AppError from "../../errorHelpers/AppError.js";
import httpStatus from "http-status-codes";
import Coupon from "./coupon.model.js";


const createCoupon = async (payload, userId) => {

  const coupon = await Coupon.create({ ...payload, user: userId });
  return coupon;
};

const getAllCoupon = async () => {
  return await Coupon.find()
    .populate("user", "name avatar")
    .sort({ createdDate: -1 });
};

const getSingleCoupon = async (coupon) => {
  const today = new Date();

  return await Coupon.findOne({
    code: coupon,
    expireDate: { $gte: today },
  })
    .populate("user", "name avatar email address phone")
    .sort({ createdDate: -1 });
};



const updateCoupon = async (id, payload) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new AppError(httpStatus.NOT_FOUND, "Test not found");

 const updatedCoupon = Coupon.findByIdAndUpdate(id, payload)
  return updatedCoupon;
};


const deleteCoupon = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new AppError(httpStatus.NOT_FOUND, "Test not found");

  await Coupon.findByIdAndDelete(id);
  return true;
};

export const CouponServices = {
 createCoupon,
 getAllCoupon,
 getSingleCoupon,
 updateCoupon,
 deleteCoupon
};
