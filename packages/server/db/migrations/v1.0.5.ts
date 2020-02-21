import * as Knex from "knex";

function baseTable(t: Knex.CreateTableBuilder, knex: Knex) {
	t.bigIncrements("id")
	t.timestamp("createdAt").defaultTo(knex.fn.now())
	t.boolean("deleted").defaultTo(false)
}

export async function up(knex: Knex): Promise<any> {
	return knex.transaction(async trx => {
		return trx.schema
		.createTable("History", t => {
			baseTable(t, trx)
			t.string("totalPrice")
			t.string("user")
			t.string("detail_transaction")
		})
	})
}

export async function down(knex: Knex): Promise<any> {
	return knex.transaction(async trx => {
		return trx.schema
			// .dropTable("Song")
	})
};