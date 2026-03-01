import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../auth/auth.model.js";
import { CouponControllers } from "./coupon.controller.js";

const router = Router();

// News routes
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CouponControllers.createCoupon);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CouponControllers.getAllCoupon);
router.get("/single/:coupon", CouponControllers.getSingleCoupon);
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CouponControllers.updateCoupon);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CouponControllers.deleteCoupon);

export const CouponRoutes = router;
