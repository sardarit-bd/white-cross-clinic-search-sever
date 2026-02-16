import { Router } from "express";
import { CategoryControllers } from "./category.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../auth/auth.model.js";

const router = Router();

// Category routes
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CategoryControllers.createCategory);
router.get("/", CategoryControllers.getCategories);
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CategoryControllers.updateCategory);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CategoryControllers.deleteCategory);

// Subcategory routes
router.post("/subcategory", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CategoryControllers.createSubcategory);
router.get("/subcategory", CategoryControllers.getSubcategories);
router.put("/subcategory/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CategoryControllers.updateSubcategory);
router.delete("/subcategory/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CategoryControllers.deleteSubcategory);

export const CategoryRoutes = router;
