import { Router } from "express";
import { NewsControllers } from "./news.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../auth/auth.model.js";

const router = Router();

// News routes
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), NewsControllers.createNews);
router.get("/", NewsControllers.getNews);
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), NewsControllers.updateNews);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), NewsControllers.deleteNews);

export const NewsRoutes = router;
