import bcrypt from "bcrypt"
import { route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { Song } from "../../../model/domain"
import { bind } from "plumier"
import { LoginUser } from "../../../model/domain"

import { managerOrAdmin } from '../../../validator/manager-or-admin-validator'

// function ownerOrAdmin() {
// 	return authorize.custom(async ({role, ctx, user}) => {
// 			return role.some(x => x === "Admin") || user && user.userId === user.userId
// 	}, "Admin|Owner")
// }

export class SongsController {
    
		// POST /api/v1/songs
		@authorize.public()
    @route.post("")
		save(data: Song, @bind.user() user: LoginUser) {
			return db("Song").insert(<Song>{ ...data })
    }

		// GET /api/v1/songs?offset=<number>&limit=<number>
		@authorize.public()
		// @authorize.role("Admin")
    @route.get("")
    list(offset: number=0, limit: number=50) {
        return db("Song").where({deleted: 0})
        .offset(offset).limit(limit)
        .orderBy("createdAt", "desc")
    }

		// GET /api/v1/songs/:id
		@authorize.public()
		// @authorize.role("Admin")
    @route.get(":id")
    get(id: number) {
        return db("Song").where({ id }).first()
    }

		// PUT /api/v1/songs/:id
		@managerOrAdmin()
    @route.put(":id")
    modify(id: number, data: Song) {
        return db("Song").update(data).where({ id })
		}

		// DELETE /api/v1/songs/:id
		@managerOrAdmin()
    @route.delete(":id")
    delete(id: number) {
        return db("Song").update({ deleted: 1 }).where({ id })
    }
}