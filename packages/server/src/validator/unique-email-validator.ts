import { val } from "plumier"
import { db } from "../model/db";

export function uniqueEmail() {
		return val.custom(async x => {
				const user = await db("User").where({ email: x }).first()
				console.log(user)
        return user ? "Email already used" : undefined 
		})
}