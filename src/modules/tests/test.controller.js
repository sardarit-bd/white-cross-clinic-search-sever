import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { TestServices } from "./test.services.js";

// Create news
const createTest = catchAsync(async (req, res) => {
  const { userId } = req.user
  const test = await TestServices.createTest(req.body, userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Test created successfully",
    data: test
  });
});

// Get all news
const getTests = catchAsync(async (req, res) => {
  const testList = await TestServices.getTest();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Test fetched successfully",
    data: testList
  });
});

const getSingleTestBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params
  const tests = await TestServices.getSingleTestBySlug(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Test fetched successfully",
    data: tests
  });
});

// Update news
const updateTest = catchAsync(async (req, res) => {
  const updatedTest = await TestServices.updateTest(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Test updated successfully",
    data: updatedTest
  });
});

// Delete news
const deleteTest = catchAsync(async (req, res) => {
  await TestServices.deleteTest(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Test deleted successfully",
    data: null
  });
});

export const TestControllers = {
  createTest,
  getSingleTestBySlug,
  getTests,
  updateTest,
  deleteTest
};
