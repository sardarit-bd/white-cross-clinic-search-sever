import { Router } from "express";
import { AuthControllers } from "./auth.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "./auth.model.js";
import { AuthServices } from "./auth.services.js";

const router = Router();

router.post("/register", AuthControllers.createUser);
router.get('/me', checkAuth(...Object.values(Role)), AuthControllers.getMe)
router.delete('/delete-me', checkAuth(Role.DOCTOR, Role.PATIENT, Role.ADMIN), AuthControllers.deleteMe)

router.post("/login", AuthControllers.credentialsLogin);
router.post("/logout", AuthControllers.logout);

router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword);
router.post("/forgot-password", AuthControllers.forgotPassword);
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);
router.post("/send-email", AuthControllers.sendEmail)

export const AuthRoutes = router;
