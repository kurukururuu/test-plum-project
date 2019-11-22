import "@plumier/serve-static"
import {route, response, authorize} from "plumier"
import { join } from "path"

export class HomeController {
		@authorize.public()
    @route.get("/")
    @route.historyApiFallback()
    index(){
				return { hello: "world" }
        // return response.file(join(__dirname, "../../../ui/dist/index.html"))
    }
}