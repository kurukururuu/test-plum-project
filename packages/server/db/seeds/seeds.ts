import * as Knex from "knex";
import { User } from "../../src/model/domain";
import bcrypt from "bcrypt"

async function addDefaultAdmin(knex:Knex){
    const defaultUserEmail = "admin@wp.app"
    const defaultUserPassword = await bcrypt.hash("wp123456", 10)
    const exists = await knex.table("User").where({email: defaultUserEmail}).first()
    if(!exists){
        await knex.table("User").insert(<User>{
            email: defaultUserEmail,
            password: defaultUserPassword,
            name: "Super Admin",
            role: "Admin"
        })
    }
}

export function seed(knex: Knex): Promise<any> {
    return Promise.all([
        addDefaultAdmin(knex)
    ])
}