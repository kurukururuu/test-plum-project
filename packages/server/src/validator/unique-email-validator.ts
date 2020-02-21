import { val } from "plumier"
import { db } from "../model/db";

export function uniqueEmail() {
	return val.custom(async (x, info) => {
		const user = await db("User").where({ email: x }).first()
		if (info.ctx.request.method === 'PUT') {
			return undefined
		} else {
			return user ? "Email already used" : undefined
		}
	})
}