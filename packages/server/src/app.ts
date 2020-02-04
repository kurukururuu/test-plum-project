import Koa from "koa";
import Plumier, { Configuration, WebApiFacility, Middleware, Invocation, ActionResult } from "plumier";
import { ServeStaticFacility } from "@plumier/serve-static";
import { join } from "path";
import { JwtAuthFacility } from "@plumier/jwt"
import dotenv from "dotenv"
import { execute } from "graphql";

dotenv.config()

export class MyGlobalErrorHandlerMiddleware implements Middleware {
	async execute(next: Readonly<Invocation>): Promise<ActionResult> {
		try {
			return await next.proceed()
		} catch (e) {
			//process the error and return JSON with ActionResult
			switch (e.status) {
				case 404:
					e.message = 'Route not found'
			}
			throw e
		}
	}
}

export function createApp(config?:Partial<Configuration>): Promise<Koa> {
	return new Plumier()
		.set(config || {})
		.use(new MyGlobalErrorHandlerMiddleware())
		.set(new WebApiFacility())
		.set(new JwtAuthFacility({ secret: process.env.JWT_SECRET }))
		.set(new ServeStaticFacility({ root: join(__dirname, "../../ui/dist") }))
		.initialize()
}
