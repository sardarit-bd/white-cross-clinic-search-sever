import { Router } from "express";
import { TestBookingControllers } from "./testBooking.controller.js";

const router = Router();

router.get("/dates", TestBookingControllers.getBookableDates);
router.get("/slots", TestBookingControllers.getAvailableSlots);
router.post("/", TestBookingControllers.createBooking);

export const TestBookingRoutes = router;