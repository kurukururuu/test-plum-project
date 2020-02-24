import * as Knex from "knex";

function baseTable(t: Knex.CreateTableBuilder, knex: Knex) {
	t.bigIncrements("id")
	t.timestamp("createdAt").defaultTo(knex.fn.now())
	t.boolean("deleted").defaultTo(false)
}

export async function up(knex: Knex): Promise<any> {
	return knex.transaction(async trx => {
		return trx.schema
		.table("History", t => {
			t.string("status")
		})
	})
}

export async function down(knex: Knex): Promise<any> {
	return knex.transaction(async trx => {
		return trx.schema
			// .dropTable("Song")
	})
};