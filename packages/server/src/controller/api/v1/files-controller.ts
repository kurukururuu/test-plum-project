import { route, val, authorize, bind, FileParser, response } from "plumier"

import { join } from "path";
import { db } from "../../../model/db"

import { managerOrAdmin } from '../../../validator/manager-or-admin-validator'

// function managerOrAdmin() {
// 	return authorize.custom(async ({role, ctx, user}) => {
// 		console.log(role, role.some(x => (x === "Admin") || (x ===  "Manager")))
// 		role.some(x => x === "Admin") || user && user.userId === user.userId
// 		return false
// 		// return role.some(x => x === "Admin") || user && user.userId === user.userId
// 	}, "Admin|Owner")
// }

export class FilesController {
    
	// POST /api/v1/files
	@authorize.public()
	// @authorize.role("Admin")
	// @managerOrAdmin()
	@route.post("")
	async upload(@bind.file() parser: FileParser, @bind.ctx() ctx:any) {
	// console.log(process.env.HOST)
		const files = await parser.save()
		// files store information about uploaded files (single file or multiple files)
		return {
			fileUrl: process.env.HOST_URL + response.file(files[0].fileName).body
		}
	}
}
