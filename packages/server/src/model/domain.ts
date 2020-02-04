import { domain, val, authorize } from "plumier";
import { uniqueEmail } from "../validator/unique-email-validator";

export type UserRole = "User" | "Admin"

@domain()
export class Domain {
    constructor(
				@authorize.role("Machine")
        public id: number = 0,
        @authorize.role("Machine")
        public createdAt: Date = new Date(),
        @val.optional()
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
        @val.optional()
        public completed: boolean = false
    ) { super() }
}

@domain()
export class Song extends Domain {
    constructor(
				public title:string,
				public artist:string,
        @val.optional()
				public link:string,
        @val.optional()
				public completed: boolean = false,
    ) { super() }
}

@domain()
export class Menu extends Domain {
    constructor(
				public name:string,
				public price:string,
				public stock:number,
				public item_code:string,
        @val.optional()
				public completed: boolean = false,
    ) { super() }
}

@domain()
export class LoginUser {
    constructor(
        public userId:number,
        public role: UserRole
    ){}
}