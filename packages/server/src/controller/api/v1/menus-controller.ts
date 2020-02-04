import bcrypt from "bcrypt"
import { HttpStatusError, route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { Menu } from "../../../model/domain"
import { bind } from "plumier"
import { LoginUser } from "../../../model/domain"

function ownerOrAdmin() {
	return authorize.custom(async ({ role, user, parameters }) => {
			return role.some(x => x === "Admin") || parameters[0] === user.userId
	}, "Admin|Owner")
}

export class MenusController {
    
		// POST /api/v1/menus
		// @authorize.public()
		@authorize.role("Admin")
    @route.post("")
		save(data: Menu, @bind.user() user: LoginUser) {
			return db("Menu").insert(<Menu>{ ...data })
    }

		// GET /api/v1/menus?offset=<number>&limit=<number>
		@authorize.public()
		// @authorize.role("Admin")
    @route.get("")
    list(@val.optional() offset: number=0, @val.optional() limit: number=50) {
        return db("Menu").where({deleted: 0})
        .offset(offset).limit(limit)
        .orderBy("createdAt", "desc")
    }

		// GET /api/v1/menus/:id
		// @authorize.public()
		@authorize.role("Admin")
    @route.get(":id")
    get(id: number) {
        return db("Menu").where({ id }).first()
    }

		// PUT /api/v1/menus/:id
		@ownerOrAdmin()
    @route.put(":id")
    modify(id: number, data: Menu) {
        return db("Menu").update(data).where({ id })
		}

		// DELETE /api/v1/menus/:id
		@ownerOrAdmin()
    @route.delete(":id")
    delete(id: number) {
        return db("Menu").update({ deleted: 1 }).where({ id })
		}
		
		// POST /api/v1/menus/:id/buy
		@authorize.public()
		// @ownerOrAdmin()
		@route.post(":code/buy")
		async buy(code: string, quantity: number) {
				const currentItem = await db("Menu").where({ item_code:code }).first()
				if (currentItem) {
					if (currentItem.stock > quantity) {
						await db("Menu").where({item_code: code}).first().update({stock:currentItem.stock-quantity})
						return db("Menu").where({item_code: code}).first()
					} else {
						throw new HttpStatusError(400, "stock is not enough")
					}
				} else throw new HttpStatusError(400, "item not found")
		}
}