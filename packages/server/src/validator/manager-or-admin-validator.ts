import { authorize } from 'plumier'

export function managerOrAdmin() {
	return authorize.custom(async ({role, ctx, user}) => {
		return role.some(x => x === "Admin") || user && user.userId === user.userId
	}, "Admin|Owner")
}