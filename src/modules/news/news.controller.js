import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { NewsServices } from "./news.services.js";

// Create news
const createNews = catchAsync(async (req, res) => {
  const news = await NewsServices.createNews(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "News created successfully",
    data: news
  });
});

// Get all news
const getNews = catchAsync(async (req, res) => {
  const newsList = await NewsServices.getNews();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News fetched successfully",
    data: newsList
  });
});

// Update news
const updateNews = catchAsync(async (req, res) => {
  const news = await NewsServices.updateNews(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News updated successfully",
    data: news
  });
});

// Delete news
const deleteNews = catchAsync(async (req, res) => {
  await NewsServices.deleteNews(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News deleted successfully",
    data: null
  });
});

export const NewsControllers = {
  createNews,
  getNews,
  updateNews,
  deleteNews
};
