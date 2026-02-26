import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { UsersRoutes } from "../modules/users/user.routes.js";
import { CategoryRoutes } from "../modules/category/category.routes.js";
import { DepartmentRoutes } from "../modules/department/department.routes.js";
import { NewsRoutes } from "../modules/news/news.routes.js";
import { UploadRoutes } from "../modules/upload/upload.routes.js";
import { DoctorsAppointmentRoutes } from "../modules/schedule/doctorAppointment.routes.js";
import { SearchRoutes } from "../modules/Search/search.routes.js";
import { TestRoutes } from "../modules/tests/test.routes.js";
import { PaymentRoutes } from "../modules/payment/payment.routes.js";



export const router = Router()

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/users',
        route: UsersRoutes
    },
    {
        path: "/category",
        route: CategoryRoutes
    },
    {
        path: "/department",
        route: DepartmentRoutes
    },
    {
        path: "/news",
        route: NewsRoutes
    },
    {
        path: "/upload",
        route: UploadRoutes
    }
    ,
    {
        path: "/doctor-appointment",
        route: DoctorsAppointmentRoutes
    },
    {
        path: "/search",
        route: SearchRoutes
    },
    {
        path: "/tests",
        route: TestRoutes
    },
    {
        path: "/payments",
        route: PaymentRoutes
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})