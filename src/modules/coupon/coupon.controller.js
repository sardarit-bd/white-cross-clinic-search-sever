import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { CouponServices } from "./coupon.services.js";

// Create news
const createCoupon = catchAsync(async (req, res) => {
  const { userId } = req.user
  const coupon = await CouponServices.createCoupon(req.body, userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New Coupon is created successfully",
    data: coupon
  });
});

// Get all news
const getAllCoupon = catchAsync(async (req, res) => {
  const couponList = await CouponServices.getAllCoupon();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Coupon are fetched successfully",
    data: couponList
  });
});

const getSingleCoupon = catchAsync(async (req, res) => {
  const { coupon } = req.params
  const hasCoupon = await CouponServices.getSingleCoupon(coupon);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon is fetched successfully",
    data: hasCoupon
  });
});

// Update news
const updateCoupon = catchAsync(async (req, res) => {
  const updatedCoupon = await CouponServices.updateCoupon(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Test updated successfully",
    data: updatedCoupon
  });
});

// Delete news
const deleteCoupon = catchAsync(async (req, res) => {
  await CouponServices.deleteCoupon(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon is deleted successfully",
    data: null
  });
});

export const CouponControllers = {
 createCoupon,
 getAllCoupon,
 getSingleCoupon,
 updateCoupon,
 deleteCoupon
};
