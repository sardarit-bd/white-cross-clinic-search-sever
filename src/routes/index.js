import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { UsersRoutes } from "../modules/users/user.routes.js";




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
 
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})