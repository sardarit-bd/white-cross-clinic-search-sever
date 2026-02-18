import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserControllers } from "./user.controller.js";
import { Role } from "../auth/auth.model.js";

const router = Router();

router.patch("/update-profile", checkAuth(...Object.values(Role)), UserControllers.updateProfile);
router.patch("/verification", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.verifyUser);

router.get('/profile', checkAuth(...Object.values(Role)), UserControllers.getProfile);
router.get('/single-profile/:id',  UserControllers.getSingleProfile);
router.get('/users', UserControllers.getAllUsers)
router.get("/doctors/:id", UserControllers.getDoctorsBySubDeprtment)
router.get("/doctors-by-department/:id", UserControllers.getDoctorsByDeprtment)


export const UsersRoutes = router;