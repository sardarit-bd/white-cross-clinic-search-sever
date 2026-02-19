import { News } from "./news.model.js";
import { Category, SubCategory } from "../category/category.model.js";
import AppError from "../../errorHelpers/AppError.js";
import httpStatus from "http-status-codes";

// Create News
export const createNews = async (payload, userId) => {
  const { category, subcategory } = payload;

  const hasCategory = await Category.findById(category);
  if (!hasCategory) throw new AppError(httpStatus.BAD_REQUEST, "Category not found");

  const hasSubCategory = await SubCategory.findById(subcategory);
  if (!hasSubCategory) throw new AppError(httpStatus.BAD_REQUEST, "Subcategory not found");

  const news = await News.create({ ...payload, user: userId });
  return news;
};

// Get all news
export const getNews = async () => {
  return await News.find()
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("user", "name avatar")
    .sort({ createdDate: -1 });
};

export const getSingleNewsBySlug = async (slug) => {
  return await News.findOne({slug: slug})
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("user", "name avatar email address phone")
    .sort({ createdDate: -1 });
};

export const getNewsBySubCategory = async (id) => {
  return await News.find({subcategory: id})
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("user", "name avatar")
    .sort({ createdDate: -1 });
};

// Update news
export const updateNews = async (id, payload) => {
  const news = await News.findById(id);
  if (!news) throw new AppError(httpStatus.NOT_FOUND, "News not found");

  if (payload.category) {
    const category = await Category.findById(payload.category);
    if (!category) throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
    news.category = payload.category;
  }

  if (payload.subcategory) {
    const subCategory = await SubCategory.findById(payload.subcategory);
    if (!subCategory) throw new AppError(httpStatus.BAD_REQUEST, "Subcategory not found");
    news.subcategory = payload.subcategory;
  }

  news.title = payload.title || news.title;
  news.image = payload.image || news.image;
  news.tags = payload.tags || news.tags;

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
  deleteNews,
  getNewsBySubCategory,
  getSingleNewsBySlug
};
