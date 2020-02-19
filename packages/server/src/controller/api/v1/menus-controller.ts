import { HttpStatusError, route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { bind } from "plumier"
import { LoginUser, Menu } from "../../../model/domain"

import { managerOrAdmin } from '../../../validator/manager-or-admin-validator'

// function ownerOrAdmin() {
// 	return authorize.custom(async ({role, ctx, user}) => {
// 		return role.some(x => x === "Admin") || user && user.userId === user.userId
// 	}, "Admin|Owner")
// }

export class MenusController {
    
		// POST /api/v1/menus
		@managerOrAdmin()
		// @authorize.role("Admin")
    @route.post("")
		async save(data: Menu, @bind.user() user: LoginUser) {
			const id = await db("Menu").insert(<Menu>{ ...data, user_id: user.userId })
			const menu = await db("Menu").where({ id }).first()
			return menu
    }

		// GET /api/v1/menus?offset=<number>&limit=<number>
		@authorize.public()
		// @authorize.role("Admin")
    @route.get("")
    list(offset: number=0, limit: number=50) {
			return db("Menu").where({deleted: 0})
			.offset(offset).limit(limit)
			.orderBy("createdAt", "desc")
    }

		// GET /api/v1/menus/:id
		@authorize.public()
		// @authorize.role("Admin")
    @route.get(":id")
    get(id: number) {
			return db("Menu").where({ id }).first()
    }

		// PUT /api/v1/menus/:id
		@managerOrAdmin()
    @route.put(":id")
    async modify(id: number, data: Menu) {
			await db("Menu").update(data).where({ id })
			const menu = db("Menu").where({ id }).first()
			return menu
		}

		// DELETE /api/v1/menus/:id
		@managerOrAdmin()
    @route.delete(":id")
    async delete(id: number) {
			await db("Menu").update({ deleted: 1 }).where({ id })
			return `success delete menu`
		}
		
		// POST /api/v1/menus/:id/buy
		@authorize.public()
		// @managerOrAdmin()
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

		// POST /api/v1/menus/buy
		@authorize.public()
		// @managerOrAdmin()
		@route.post("buy")
		async buyMany(list: [{item_code: null, quantity: number}]) {
			const result = await asyncForEach(list, async (element: {item_code: null, quantity: number}, index: number) => {
				const item = {
					item_code: element.item_code,
					status: {}
				}
				
				const currentItem = await db("Menu").where({ item_code:element.item_code }).first()

				if (currentItem) {
					let updatedItem = {}

					if (currentItem.stock > element.quantity) {
						await db("Menu").where({item_code: currentItem.item_code}).first().update({stock:currentItem.stock - element.quantity})
						updatedItem = await db("Menu").where({item_code: currentItem.item_code}).first()
						item.status = {
							message: 'Success',
							data: updatedItem
						}
					} else {
						item.status = {
							message: 'stock is not enough',
							data: currentItem
						}
					}
				} else {
					item.status = {
						message: 'item not found',
						data: {}
					}
				}

				return item
			})

			return result
		}
}

async function asyncForEach(array: [{item_code: null, quantity: number}], callback: Function) {
	let arr = new Array
	for (let index = 0; index < array.length; index++) {
		const result = await callback(array[index], index, array);
		arr.push(result)
	}
	return arr
}
