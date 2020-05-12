import { Role } from "./Role";

export class User {
    userId: number;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role; // Double check that this shouldn't be a foreign key instead.

    constructor(userId: number, password: string, firstName: string, lastName: string, email: string, role: Role) {
        this.userId = userId;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }
}