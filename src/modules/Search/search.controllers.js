import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { SearchService } from "./search.services.js";
import httpStatus from 'http-status-codes'


const getDoctorsAndArticles = catchAsync(async (req, res) => {
    const { query, ai } = req.query
    const department = await SearchService.searchDoctorsAndArticles(query,ai);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctors and Articled are fetched successfully",
        data: department
    });
});

export const SearchControllers = {
    getDoctorsAndArticles
}