import { Department, SubDepartment } from "./department.model.js";
import AppError from "../../errorHelpers/AppError.js";
import httpStatus from "http-status-codes";

// Main Department Services
export const createDepartment = async (payload) => {
  const isExist = await Department.findOne({ name: payload.name });
  if (isExist) throw new AppError(httpStatus.BAD_REQUEST, "Department already exists");

  const department = await Department.create(payload);
  return department;
};

export const getDepartments = async () => {
  return await Department.find().sort({ createdAt: -1 });
};

export const updateDepartment = async (id, payload) => {
  const department = await Department.findById(id);
  if (!department) throw new AppError(httpStatus.NOT_FOUND, "Department not found");

  department.name = payload.name || department.name;
  department.intro = payload.intro || department.intro;
  department.description = payload.description || department.description;
  department.image = payload.image || department.image;
  await department.save();

  return department;
};

export const deleteDepartment = async (id) => {
  const department = await Department.findById(id);
  if (!department) throw new AppError(httpStatus.NOT_FOUND, "Department not found");

  await Department.findByIdAndDelete(id);
  await SubDepartment.deleteMany({ department: id }); // remove subdepartments
  return true;
};

// Sub Department Services
export const createSubDepartment = async (payload) => {
  const { name, department } = payload;

  const mainDepartment = await Department.findById(department);
  if (!mainDepartment) throw new AppError(httpStatus.BAD_REQUEST, "Main department does not exist");

  const isExist = await SubDepartment.findOne({ name, department });
  if (isExist) throw new AppError(httpStatus.BAD_REQUEST, "Subdepartment already exists under this department");

  const subDepartment = await SubDepartment.create(payload);
  return subDepartment;
};

export const getSubDepartments = async () => {
  return await SubDepartment.find().populate("department", "name slug").sort({ createdAt: -1 });
};

export const updateSubDepartment = async (id, payload) => {
  const subDepartment = await SubDepartment.findById(id);
  if (!subDepartment) throw new AppError(httpStatus.NOT_FOUND, "Subdepartment not found");

  subDepartment.name = payload.name || subDepartment.name;
  await subDepartment.save();
  return subDepartment;
};

export const deleteSubDepartment = async (id) => {
  const subDepartment = await SubDepartment.findById(id);
  if (!subDepartment) throw new AppError(httpStatus.NOT_FOUND, "Subdepartment not found");

  await SubDepartment.findByIdAndDelete(id);
  return true;
};

export const DepartmentServices = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  createSubDepartment,
  getSubDepartments,
  updateSubDepartment,
  deleteSubDepartment
};
