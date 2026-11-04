import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { TestBookingServices } from "./testBooking.services.js";

const getBookableDates = catchAsync(async (req, res) => {
  const dates = TestBookingServices.getBookableDates();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookable dates fetched successfully",
    data: dates,
  });
});

const getAvailableSlots = catchAsync(async (req, res) => {
  const slots = await TestBookingServices.getAvailableSlots(req.query.date);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Available slots fetched successfully",
    data: slots,
  });
});

const createBooking = catchAsync(async (req, res) => {
  const booking = await TestBookingServices.createBooking(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking confirmed successfully",
    data: booking,
  });
});

export const TestBookingControllers = {
  getBookableDates,
  getAvailableSlots,
  createBooking,
};