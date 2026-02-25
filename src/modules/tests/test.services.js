import AppError from "../../errorHelpers/AppError.js";
import httpStatus from "http-status-codes";
import Test from "./tests.model.js";

// Create News
export const createTest = async (payload, userId) => {

  const test = await Test.create({ ...payload, user: userId });
  return test;
};

// Get all news
export const getTest = async () => {
  return await Test.find()
    .populate("user", "name avatar")
    .sort({ createdDate: -1 });
};

export const getSingleTestBySlug = async (slug) => {
  return await Test.findOne({slug: slug})
    .populate("user", "name avatar email address phone")
    .sort({ createdDate: -1 });
};



// Update news
export const updateTest = async (id, payload) => {
  const test = await Test.findById(id);
  if (!test) throw new AppError(httpStatus.NOT_FOUND, "Test not found");

 const updateTest = Test.findByIdAndUpdate(id, payload)
  return updateTest;
};

// Delete news
export const deleteTest = async (id) => {
  const test = await Test.findById(id);
  if (!test) throw new AppError(httpStatus.NOT_FOUND, "Test not found");

  await Test.findByIdAndDelete(id);
  return true;
};

export const TestServices = {
 createTest,
 updateTest,
 deleteTest,
 getSingleTestBySlug,
 getTest
};
