import { Router } from "express";
import { DepartmentControllers } from "./department.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../auth/auth.model.js";

const router = Router();

// Main Department routes
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DepartmentControllers.createDepartment);
router.get("/", DepartmentControllers.getDepartments);
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DepartmentControllers.updateDepartment);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DepartmentControllers.deleteDepartment);

// Sub Department routes
router.post("/subdepartment", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DepartmentControllers.createSubDepartment);
router.get("/subdepartment", DepartmentControllers.getSubDepartments);
router.put("/subdepartment/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DepartmentControllers.updateSubDepartment);
router.delete("/subdepartment/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DepartmentControllers.deleteSubDepartment);

export const DepartmentRoutes = router;
