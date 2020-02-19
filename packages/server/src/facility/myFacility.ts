import Cors from "@koa/cors"
import { DefaultFacility, PlumierApplication } from "plumier"

export class MyFacility extends DefaultFacility {
	async setup({ koa }: Readonly<PlumierApplication>) {
		//do something with the Koa instance
		koa.use(Cors({origin: "*"}))
	}
}

export default MyFacility