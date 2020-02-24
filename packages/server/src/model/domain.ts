import { domain, val, authorize } from "plumier";
import { uniqueEmail } from "../validator/unique-email-validator";
import { uniqueItemCode } from "../validator/unique-item-code-validator";

export type UserRole = "Waiter" | "Manager" | "Admin"

@domain()
export class Domain {
	constructor(
		@authorize.role("Machine")
		public id: number = 0,
		@authorize.role("Machine")
		public createdAt: Date = new Date(),
		public deleted:boolean = false
	) { }
}

@domain()
export class User extends Domain {
	constructor(
		@val.email()
		@uniqueEmail()
		public email: string,
		public password: string,
		public name: string,
		@authorize.role("Admin")
		public role: UserRole
	) { super() }
}

@domain()
export class Todo extends Domain {
	constructor(
		public todo: string,
		@authorize.role("Machine")
		public userId:number,
		public completed: boolean = false
	) { super() }
}

@domain()
export class Song extends Domain {
	constructor(
		@val.required()
		public title:string,
		@val.required()
		public artist:string,
		public link:string,
		public completed: boolean = false,
	) { super() }
}

@domain()
export class Menu extends Domain {
	constructor(
		@val.required()
		public name:string,
		@val.required()
		public price:string,
		public stock:number = 0,
		@val.required()
		@uniqueItemCode()
		public item_code:string,
		public category:string = 'food',
		public menu_description: string,
		public menu_picture: string,
		public status:string = 'active',
		public completed:boolean = false,
		public user_id:number,
	) { super() }
}

@domain()
export class LoginUser {
	constructor(
		public userId:number,
		public role:UserRole
	){}
}

@domain()
export class Relations {
	constructor(
		public relations:string
	){}
}

@domain()
export class History extends Domain {
	constructor(
		public totalPrice:string,
		public user:User,
		public status:string = 'in process',
		public detail_transaction: any
	) { super() }
}