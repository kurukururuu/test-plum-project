import bcrypt from "bcrypt"
import { route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { User } from "../../../model/domain"

function ownerOrAdmin() {
	return authorize.custom(async ({ role, user, parameters }) => {
			return role.some(x => x === "Admin") || parameters[0] === user.userId
	}, "Admin|Owner")
}

export class UsersController {
    
		// POST /api/v1/users
		@authorize.public()
    @route.post("")
    async save(data: User) {
        const password = await bcrypt.hash(data.password, 10)
        return db("User").insert({ ...data, password, role: "User" })
    }

		// GET /api/v1/users?offset=<number>&limit=<number>
		@authorize.role("Admin")
    @route.get("")
    list(@val.optional() offset: number=0, @val.optional() limit: number=50) {
        return db("User").where({deleted: 0})
        .offset(offset).limit(limit)
        .orderBy("createdAt", "desc")
    }

		// GET /api/v1/users/:id
		@authorize.role("Admin")
    @route.get(":id")
    get(id: number) {
        return db("User").where({ id }).first()
    }

		// PUT /api/v1/users/:id
		@ownerOrAdmin()
    @route.put(":id")
    async modify(id: number, data: User) {
        const password = await bcrypt.hash(data.password, 10)
        return db("User").update({...data, password}).where({ id })
    }

		// DELETE /api/v1/users/:id
		@ownerOrAdmin()
    @route.delete(":id")
    delete(id: number) {
        return db("User").update({ deleted: 1 }).where({ id })
    }
}