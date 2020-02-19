import { route, val, authorize } from "plumier"

import { db } from "../../../model/db"
import { Todo } from "../../../model/domain"
import { bind } from "plumier"
import { LoginUser } from "../../../model/domain"

function ownerOrAdmin() {
	return authorize.custom(async ({role, ctx, user}) => {
			const todo: Todo = await db("Todo").where({ id: ctx.parameters[0] }).first()
			return role.some(x => x === "Admin") || todo && todo.userId === user.userId
	}, "Admin|Owner")
}

export class TodosController {
    
    // POST /api/v1/todos
    @route.post("")
    save(data: Todo, @bind.user() user: LoginUser) {
			return db("Todo").insert(<Todo>{ ...data, userId: user.userId })
    }

    // GET /api/v1/todos?offset=<number>&limit=<number>
    @route.get("")
    list(offset: number=0, limit: number=25) {
        return db("Todo").where({deleted: 0})
            .offset(offset).limit(limit)
            .orderBy("createdAt", "desc")
    }

    // GET /api/v1/todos/:id
    @route.get(":id")
    get(id: number) {
        return db("Todo").where({ id }).first()
		}
		
		// PUT /api/v1/todos/:id
		@ownerOrAdmin()
    @route.put(":id")
    modify(id: number, data: Todo) {
        return db("Todo").update(data).where({ id })
		}
		
    // DELETE /api/v1/todos/:id
		@ownerOrAdmin()
    @route.delete(":id")
    delete(id: number) {
        return db("Todo").update({ deleted: true }).where({ id })
    } 
}