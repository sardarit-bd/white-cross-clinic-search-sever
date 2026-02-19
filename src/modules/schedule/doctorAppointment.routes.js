import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../auth/auth.model.js";
import { DoctoAppointControllers } from "./doctorAppointment.controllers.js";

const router = Router();

router.post("/", checkAuth(...Object.values(Role)), DoctoAppointControllers.createDoctorAppointment);
router.get("/patient", checkAuth(...Object.values(Role)), DoctoAppointControllers.getDoctorAppointmentByPatient)
router.get("/doctor", checkAuth(...Object.values(Role)), DoctoAppointControllers.getDoctorAppointmentByDoctor)
router.delete("/:id", checkAuth(...Object.values(Role)), DoctoAppointControllers.deleteDoctorAppointment)



export const DoctorsAppointmentRoutes = router;
