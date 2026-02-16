import { Category, SubCategory } from "./category.model.js";
import AppError from "../../errorHelpers/AppError.js";
import httpStatus from "http-status-codes";

export const createCategory = async (payload) => {
  const isExist = await Category.findOne({ name: payload.name });
  if (isExist) throw new AppError(httpStatus.BAD_REQUEST, "Category already exists");

  const category = await Category.create(payload);
  return category;
};

export const getCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const updateCategory = async (id, payload) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  category.name = payload.name || category.name;
  category.description = payload.description || category.description;
  category.thumbnail = payload.thumbnail || category.thumbnail
  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  await Category.findByIdAndDelete(id);
  await SubCategory.deleteMany({ category: id }); // remove subcategories
  return true;
};

// Subcategory services
export const createSubcategory = async (payload) => {
  const isExist = await SubCategory.findOne({ name: payload.name });
  if (isExist) throw new AppError(httpStatus.BAD_REQUEST, "Subcategory already exists");

  const subcategory = await SubCategory.create(payload);
  return subcategory;
};

export const getSubcategories = async () => {
  return await SubCategory.find().populate("category", "name slug").sort({ createdAt: -1 });
};

export const updateSubcategory = async (id, payload) => {
  const subcategory = await SubCategory.findById(id);
  if (!subcategory) throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");

  subcategory.name = payload.name || subcategory.name;
  subcategory.category = payload.category || subcategory.category
  await subcategory.save();
  return subcategory;
};

export const deleteSubcategory = async (id) => {
  const subcategory = await SubCategory.findById(id);
  if (!subcategory) throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");

  await SubCategory.findByIdAndDelete(id);
  return true;
};

export const CategoryServices = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createSubcategory,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory
};
