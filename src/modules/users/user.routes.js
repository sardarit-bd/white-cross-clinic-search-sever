import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserControllers } from "./user.controller.js";
import { Role } from "../auth/auth.model.js";

const router = Router();

router.patch("/update-profile", checkAuth(Role.OWNER, Role.TENANT, Role.ADMIN, Role.SUPER_ADMIN), UserControllers.updateProfile);
router.patch("/verification", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.verifyUser);

router.get('/profile', checkAuth(Role.OWNER, Role.TENANT, Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getProfile);
router.get('/users', UserControllers.getAllUsers)


export const UsersRoutes = router;