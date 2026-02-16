import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { DepartmentServices } from "./department.services.js";

// Main Department Controllers
const createDepartment = catchAsync(async (req, res) => {
  const department = await DepartmentServices.createDepartment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Department created successfully",
    data: department
  });
});

const getDepartments = catchAsync(async (req, res) => {
  const departments = await DepartmentServices.getDepartments();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Departments fetched successfully",
    data: departments
  });
});

const updateDepartment = catchAsync(async (req, res) => {
  const department = await DepartmentServices.updateDepartment(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department updated successfully",
    data: department
  });
});

const deleteDepartment = catchAsync(async (req, res) => {
  await DepartmentServices.deleteDepartment(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department deleted successfully",
    data: null
  });
});

// Sub Department Controllers
const createSubDepartment = catchAsync(async (req, res) => {
  const subDepartment = await DepartmentServices.createSubDepartment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subdepartment created successfully under its main department",
    data: subDepartment
  });
});

const getSubDepartments = catchAsync(async (req, res) => {
  const subDepartments = await DepartmentServices.getSubDepartments();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subdepartments fetched successfully",
    data: subDepartments
  });
});

const updateSubDepartment = catchAsync(async (req, res) => {
  const subDepartment = await DepartmentServices.updateSubDepartment(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subdepartment updated successfully",
    data: subDepartment
  });
});

const deleteSubDepartment = catchAsync(async (req, res) => {
  await DepartmentServices.deleteSubDepartment(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subdepartment deleted successfully",
    data: null
  });
});

export const DepartmentControllers = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  createSubDepartment,
  getSubDepartments,
  updateSubDepartment,
  deleteSubDepartment
};
