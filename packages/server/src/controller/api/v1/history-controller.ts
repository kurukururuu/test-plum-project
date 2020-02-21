import { HttpStatusError, route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { bind } from "plumier"

import { managerOrAdmin } from '../../../validator/manager-or-admin-validator'

export class HistoryController {
	// GET /api/v1/menus?offset=<number>&limit=<number>
	@managerOrAdmin()
	// @authorize.role("Admin")
	@route.get("")

	async list(offset: number=0, limit: number=50) {
		const data = await db("History").where({deleted: 0})
		.offset(offset).limit(limit)
		.orderBy("createdAt", "desc")

		let arr = new Array
		data.forEach(element => {
			arr.push(parseElement(element))
		})
		return arr
	}

	// GET /api/v1/menus/:id
	@managerOrAdmin()
	@route.get(":id")
    async get(id: number) {
			const data = await db("History").where({ id }).first()
			return parseElement(data)
		}
}

function parseElement(data: any) {
	try {
		const obj = {
			...data,
			user: JSON.parse(data.user),
			detail_transaction: JSON.parse(data.detail_transaction)
		}
		return obj
	} catch (error) {
		return {
			...data,
			user: data.user,
			detail_transaction: data.detail_transaction
		}
	}
}