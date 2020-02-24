import { HttpStatusError, route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { bind } from "plumier"
import { LoginUser, Menu, Relations } from "../../../model/domain"

import { returnedUser } from "./users-controller"

import { fetchRelations } from "../../../model/relations"

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
		async save(@val.required() data: Menu, @bind.user() user: LoginUser) {
			const id = await db("Menu").insert(<Menu>{ ...data, user_id: user.userId })
			const menu = await db("Menu").where({ id:id[0] }).first()
			return menu
    }

		// GET /api/v1/menus?offset=<number>&limit=<number>&page=<number>
		@authorize.public()
		// @authorize.role("Admin")
    @route.get("")
    async list(offset: number=0, limit: number=50, page:number=1, @bind.query() model:Relations) {
			let relationArray = new Array
			let menus = await db("Menu").where({deleted: 0})
			.offset(offset).limit(limit)
			.orderBy("createdAt", "desc")
			.paginate({ perPage: limit, currentPage: page })

			if (model.relations) {
				relationArray = model.relations.split(',')
				for (const item of menus.data) {
					const payload = <any>{}

					relationArray.forEach(element => {
						payload[`${element}_id`] = item[`${element}_id`]
					})
					const resultRelation = await fetchRelations(relationArray, payload)
					for (const relation of resultRelation) {
						for (const rel in relation) {
							if (relation[rel].value) {
								item[`${rel}`] = relation[rel].value
							}
						}
					}

				}
			}
			
			return menus
    }

		// GET /api/v1/menus/:id
		@authorize.public()
		// @authorize.role("Admin")
    @route.get(":id")
    async get(@val.required() id: number, @bind.query() model:Relations) {
			let relationArray = new Array
			let menu = await db("Menu").where({ id }).first()

			if (model.relations) {
				relationArray = model.relations.split(',')
				const payload = <any>{}
				relationArray.forEach(element => {
					payload[`${element}_id`] = menu[`${element}_id`]
				})
				const resultRelation = await fetchRelations(relationArray, payload)
				resultRelation.forEach(element => {
					for (const item in element) {
						menu[`${item}`] = element[item].value
					}
				})
			}
			return menu
    }

		// PUT /api/v1/menus/:id
		@managerOrAdmin()
    @route.put(":id")
    async modify(@val.required() id: number, data: Menu, @bind.request() req:object) {
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
		async buy(@val.required() code: string, @val.required() quantity: number) {
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
		async buyMany(@val.required() list: [{item_code: null, quantity: number}], @bind.user() user: LoginUser) {
			let detail_transaction = new Array
			let totalPrice = 0

			const result = await asyncForEachMenu(list, async (element: {item_code: null, quantity: number, user: null}, index: number) => {
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
							quantity: element.quantity,
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

			result.forEach(element => {
				if (element.status.message === 'Success') {
					const obj = {
						item: <Menu>{ ...element.status.data },
						quantity: element.status.quantity
					}
					detail_transaction.push(obj)

					totalPrice += (obj.quantity * Number(obj.item.price))
				}
			})
			const userData = await db("User").where({ id:user.userId }).first()
			await db("History").insert({totalPrice, detail_transaction: JSON.stringify(detail_transaction), user: JSON.stringify(returnedUser(userData)) })

			return result
		}
}

async function asyncForEachMenu(array: [{item_code: null, quantity: number}], callback: Function) {
	let arr = new Array
	for (let index = 0; index < array.length; index++) {
		const result = await callback(array[index], index, array);
		arr.push(result)
	}
	return arr
}
