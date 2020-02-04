import { val } from "plumier"
import { db } from "../model/db";

export function uniqueItemCode() {
		return val.custom(async x => {
				const user = await db("User").where({ item_code: x }).first()
        return user ? "item code already used" : undefined 
		})
}