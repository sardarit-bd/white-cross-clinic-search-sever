import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { CategoryServices } from "./category.services.js";

// Category Controllers
const createCategory = catchAsync(async (req, res) => {
  const category = await CategoryServices.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: category
  });
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await CategoryServices.getCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: categories
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await CategoryServices.updateCategory(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: category
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await CategoryServices.deleteCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: null
  });
});

// Subcategory Controllers
const createSubcategory = catchAsync(async (req, res) => {
  const subcategory = await CategoryServices.createSubcategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subcategory created successfully",
    data: subcategory
  });
});

const getSubcategories = catchAsync(async (req, res) => {
  const subcategories = await CategoryServices.getSubcategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subcategories fetched successfully",
    data: subcategories
  });
});

const updateSubcategory = catchAsync(async (req, res) => {
  const subcategory = await CategoryServices.updateSubcategory(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subcategory updated successfully",
    data: subcategory
  });
});

const deleteSubcategory = catchAsync(async (req, res) => {
  await CategoryServices.deleteSubcategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subcategory deleted successfully",
    data: null
  });
});

export const CategoryControllers = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createSubcategory,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory
};
