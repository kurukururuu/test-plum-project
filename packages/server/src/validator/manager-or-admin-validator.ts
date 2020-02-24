import { authorize } from 'plumier'

export function managerOrAdmin() {
	return authorize.custom(async ({role, ctx, user}) => {
		// console.log(role.some(x => x === "Admin") || user && user.userId === user.userId)
		return role.some(x => x === "Admin")
	}, "Admin|Owner")
}