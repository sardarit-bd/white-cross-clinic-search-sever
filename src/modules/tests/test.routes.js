import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../auth/auth.model.js";
import { TestControllers } from "./test.controller.js";

const router = Router();

// News routes
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TestControllers.createTest);
router.get("/", TestControllers.getTests);
router.get("/single/:slug", TestControllers.getSingleTestBySlug);
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TestControllers.updateTest);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TestControllers.deleteTest);

export const TestRoutes = router;
