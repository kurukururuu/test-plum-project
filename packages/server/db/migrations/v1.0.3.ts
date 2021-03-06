import * as Knex from "knex";

function baseTable(t: Knex.CreateTableBuilder, knex: Knex) {
	t.bigIncrements("id")
	t.timestamp("createdAt").defaultTo(knex.fn.now())
	t.boolean("deleted").defaultTo(false)
}

export async function up(knex: Knex): Promise<any> {
	return knex.transaction(async trx => {
		return trx.schema
		.table("Menu", t => {
			t.string("category").defaultTo('food')
			t.string("menu_description")
			t.string("menu_picture")
			t.string("status").defaultTo('active')
		})
	})
}

export async function down(knex: Knex): Promise<any> {
	return knex.transaction(async trx => {
		return trx.schema
			.dropTable("Song")
	})
};