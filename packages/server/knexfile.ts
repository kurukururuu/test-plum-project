import { Config } from "knex"

import dotenv from "dotenv"

dotenv.config()

export const configuration: Config = {
    client: 'sqlite3',
		connection: {
      filename: './dev.sqlite3.db'
		},
		useNullAsDefault: true,
    migrations: {
        tableName: '_knex_migrations',
        directory: "./db/migrations"
    },
    seeds: {
        directory: "./db/seeds"
    }
}
export const development: Config = { ...configuration }
export const production: Config = { ...configuration }