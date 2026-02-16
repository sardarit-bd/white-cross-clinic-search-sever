import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { UsersRoutes } from "../modules/users/user.routes.js";
import { CategoryRoutes } from "../modules/category/category.routes.js";
import { DepartmentRoutes } from "../modules/department/department.routes.js";
import { NewsRoutes } from "../modules/news/news.routes.js";
import { UploadRoutes } from "../modules/upload/upload.routes.js";



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
    
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})