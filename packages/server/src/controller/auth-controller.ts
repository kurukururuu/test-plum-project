import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken"
import { HttpStatusError, route, authorize } from "plumier"

import { db } from "../model/db"
import { LoginUser, User } from "../model/domain"
import { returnedUser } from './api/v1/users-controller'

export class AuthController {

		// POST /auth/login
    @authorize.public()
    @route.post()
    async login(email: string, password: string) {
				const user = await db("User").where({ email }).first()
        if (user && await bcrypt.compare(password, user.password)) {
						const token = sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.JWT_SECRET)
            return { token, data: returnedUser(user) }
        }
        else throw new HttpStatusError(403, "Invalid username or password")
    }
}