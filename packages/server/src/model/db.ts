import knex from "knex"
import dotenv from "dotenv"

dotenv.config()

export const db = knex({
    client: "sqlite3",
		// connection: process.env.DB_URI
		connection: {
      filename: './dev.sqlite3.db'
		}
})