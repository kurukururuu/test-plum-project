import { route, val, authorize, bind, FileParser, response } from "plumier"

import { join } from "path";
import { db } from "../../../model/db"
// import { Files } from "../../../model/domain"

export class FilesController {
    
	// POST /api/v1/menus
	// @authorize.public()
	@authorize.role("Admin")
	@route.post("")
	async upload(@bind.file() parser: FileParser) {
	// async upload(files:any) {
		const files = await parser.save()
		console.log(files)
		//files store information about uploaded files (single file or multiple files)
		return {
			fileUrl: response.file(join(__dirname, `./uploads/${files[0].fileName}`)).body
		}
	}
}