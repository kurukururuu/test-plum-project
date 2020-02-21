import { returnedUser } from "../controller/api/v1/users-controller"

import { db } from "./db"

export function fetchRelations(relationArray:any[], payload:any) {
	let valid = true
	let errorResponse = ''

	const result = asyncForEachItem(relationArray, async(element:any) => {
		const key = element.replace(/^\w/, (c:string) => c.toUpperCase())
		if (!!key) {
			try {
				let value
				switch (element) {
					case 'user':
						// console.log(payload)
						const item = await db(key).where({ id:payload.user_id }).first()
						value = returnedUser(item)
						break
				}
				return { [element]: { success: true, value } }
			} catch (error) {
				valid = false
				errorResponse = element
				return { [element]: { success: false, error: error } }
			}
		}
	})

	return result
}

async function asyncForEachItem(array: any, callback: Function) {
	let arr = new Array
	for (let index = 0; index < array.length; index++) {
		const result = await callback(array[index], index, array);
		arr.push(result)
	}
	return arr
}
