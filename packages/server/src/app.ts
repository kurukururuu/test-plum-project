import Koa from "koa";
import Plumier, { Configuration, WebApiFacility } from "plumier";
import { ServeStaticFacility } from "@plumier/serve-static";
import { join } from "path";
import { JwtAuthFacility } from "@plumier/jwt"
import dotenv from "dotenv"

dotenv.config()

export function createApp(config?:Partial<Configuration>): Promise<Koa> {
    return new Plumier()
        .set(config || {})
				.set(new WebApiFacility())
				.set(new JwtAuthFacility({ secret: process.env.JWT_SECRET }))
        .set(new ServeStaticFacility({ root: join(__dirname, "../../ui/dist") }))
        .initialize()
}
