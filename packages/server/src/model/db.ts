import knex from "knex"
import dotenv from "dotenv"
import { attachPaginate } from "knex-paginate"

dotenv.config()
attachPaginate()

export const db = knex({
	client: "sqlite3",
	// connection: process.env.DB_URI
	connection: {
		filename: './dev.sqlite3.db'
	}
})