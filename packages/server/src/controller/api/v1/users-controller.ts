import bcrypt from "bcrypt"
import { route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { User } from "../../../model/domain"

import { managerOrAdmin } from '../../../validator/manager-or-admin-validator'

// function ownerOrAdmin() {
// 	return authorize.custom(async ({ role, ctx, user }) => {
// 			return role.some(x => x === "Admin") || user[0] === user.userId
// 	}, "Admin|Owner")
// }

function returnedUser(data: { password: null }) {
	const obj = data
	delete obj.password
	return obj
}

export class UsersController {
    
		// POST /api/v1/users
		// @authorize.public()
		@managerOrAdmin()
    @route.post("")
    async save(data: User) {
			const password = await bcrypt.hash(data.password, 10)
			const id = await db("User").insert({ ...data, password, role: "Waiter" })
			const user = await db("User").where({ id:id[0] }).first()
			return returnedUser(user)
    }

		// GET /api/v1/users?offset=<number>&limit=<number>
		// @authorize.role("Admin")
		@managerOrAdmin()
    @route.get("")
    async list(offset: number=0, limit: number=50) {
			let users = await db("User").where({deleted: 0})
			.offset(offset).limit(limit)
			.orderBy("createdAt", "desc")

			let arr = new Array
			users.forEach((element:any) => {
				arr.push(returnedUser(element))
			})
			return arr
    }

		// GET /api/v1/users/:id
		// @authorize.role("Admin")
		@managerOrAdmin()
    @route.get(":id")
    async get(id: number) {
			const user = await db("User").where({ id }).first()
			return returnedUser(user)
    }

		// PUT /api/v1/users/:id
		@managerOrAdmin()
    @route.put(":id")
    async modify(id: number, data: User) {
			if (data.password) {
				const password = await bcrypt.hash(data.password, 10)
				await db("User").update({...data, password}).where({ id })
			} else {
				await db("User").update({...data }).where({ id })
			}

			const updatedUser = await db("User").where({ id }).first()
			return returnedUser(updatedUser)
    }

		// DELETE /api/v1/users/:id
		@managerOrAdmin()
    @route.delete(":id")
    async delete(id: number) {
			await db("User").update({ deleted: 1 }).where({ id })
			return `success delete user`
    }
}