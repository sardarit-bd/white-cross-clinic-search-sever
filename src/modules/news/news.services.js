import { News } from "./news.model.js";
import { Category, SubCategory } from "../category/category.model.js";
import AppError from "../../errorHelpers/AppError.js";
import httpStatus from "http-status-codes";

// Create News
export const createNews = async (payload) => {
  const { categoryId, subCategoryId } = payload;

  const category = await Category.findById(categoryId);
  if (!category) throw new AppError(httpStatus.BAD_REQUEST, "Category not found");

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) throw new AppError(httpStatus.BAD_REQUEST, "Subcategory not found");

  const news = await News.create(payload);
  return news;
};

// Get all news
export const getNews = async () => {
  return await News.find()
    .populate("categoryId", "name slug")
    .populate("subCategoryId", "name slug")
    .sort({ createdDate: -1 });
};

// Update news
export const updateNews = async (id, payload) => {
  const news = await News.findById(id);
  if (!news) throw new AppError(httpStatus.NOT_FOUND, "News not found");

  if (payload.categoryId) {
    const category = await Category.findById(payload.categoryId);
    if (!category) throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
    news.categoryId = payload.categoryId;
  }

  if (payload.subCategoryId) {
    const subCategory = await SubCategory.findById(payload.subCategoryId);
    if (!subCategory) throw new AppError(httpStatus.BAD_REQUEST, "Subcategory not found");
    news.subCategoryId = payload.subCategoryId;
  }

  news.title = payload.title || news.title;
  news.image = payload.image || news.image;
  news.tags = payload.tags || news.tags;
  news.userName = payload.userName || news.userName;
  news.userProfile = payload.userProfile || news.userProfile

  await news.save();
  return news;
};

// Delete news
export const deleteNews = async (id) => {
  const news = await News.findById(id);
  if (!news) throw new AppError(httpStatus.NOT_FOUND, "News not found");

  await News.findByIdAndDelete(id);
  return true;
};

export const NewsServices = {
  createNews,
  getNews,
  updateNews,
  deleteNews
};
