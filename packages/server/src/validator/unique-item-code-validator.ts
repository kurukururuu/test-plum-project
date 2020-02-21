import { val } from "plumier"
import { db } from "../model/db";

export function uniqueItemCode() {
	return val.custom(async (x, info) => {
		const menu = await db("Menu").where({ item_code: x }).first()
		if (info.ctx.request.method === 'PUT') {
			return undefined
		} else {
			return menu ? "item code already used" : undefined
		}
	})
}