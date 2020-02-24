import { HttpStatusError, route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { bind } from "plumier"
import { LoginUser, History, Relations } from "../../../model/domain"

import { managerOrAdmin } from '../../../validator/manager-or-admin-validator'

export class HistoryController {
	// GET /api/v1/history?offset=<number>&limit=<number>
	@managerOrAdmin()
	// @authorize.role("Admin")
	@route.get("")

	async list(status: string, offset: number=0, limit: number=50, page:number=1) {
		const data = await db("History").where({deleted: 0, status: status})
		.offset(offset).limit(limit)
		.orderBy("createdAt", "desc")
		.paginate({ perPage: limit, currentPage: page })

		let arr = new Array
		data.data.forEach(element => {
			arr.push(parseElement(element))
		})
		return arr
	}

	// GET /api/v1/history/:id
	@managerOrAdmin()
	@route.get(":id")
    async get(id: number) {
			const data = await db("History").where({ id }).first()
			return parseElement(data)
		}

	// PUT /api/v1/history/:id
	@managerOrAdmin()
	@route.put(":id")
	async modify(@val.required() id: number, data: History, @bind.request() req:object) {
		if (data.user || data.detail_transaction || data.totalPrice) {
			throw new HttpStatusError(400, "user, totalPrice and detail_transaction can't be changed !")
		} else {
			if (data.status) {
				await db("History").update(data).where({ id })
				const history = db("History").where({ id }).first()
				return history
			}
		}
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