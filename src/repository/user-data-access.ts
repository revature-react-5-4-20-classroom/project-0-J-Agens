import { User } from '../models/User';
import { PoolClient, QueryResult, Pool } from 'pg';
import { connectionPool } from '.';
import { Role } from '../models/Role';

export async function getAllUsers() : Promise<User[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        let result : QueryResult = await client.query(
            `SELECT users.id, users.username, users.password, users.first_name, users.last_name, users.email, 
            roles.id AS role_id, roles.role_name
            FROM users
            INNER JOIN roles ON users.role_id = roles.id;
            `
        );
        return result.rows.map((u) => {
            return new User(
                u.id, 
                u.username, 
                u.password, 
                u.first_name, 
                u.last_name, 
                u.email, 
                new Role(u.role_id, u.role_name)
            );
        });
    } catch (error) {
        throw new Error(`Failed to query for all users: ${error.message}`);
    } finally {
        client && client.release();
    }
}

export async function getUserById(id : number) : Promise<User[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        let result : QueryResult = await client.query(`
            SELECT users.id, users.username, users.password, users.first_name, users.last_name, users.email, 
            roles.id AS role_id, roles.role_name
            FROM users
            INNER JOIN roles ON users.role_id = roles.id
            WHERE users.id = $1;
        `, [id]);
        return result.rows.map((u) => {
            return new User(
                u.id, 
                u.username, 
                u.password, 
                u.first_name, 
                u.last_name, 
                u.email, 
                new Role(u.role_id, u.role_name)
            );
        });
    } catch (error) {
        throw new Error(`Failed to query user by id: ${error.message}`);
    } finally {
        client && client.release();
    }
}

export async function updateUser(user : User) : Promise<User> {
    let client : PoolClient = await connectionPool.connect();
    try {
        // Grab the right user based on supplied id
        let findUserResult : QueryResult = await client.query(`
            SELECT *
            FROM users
            WHERE id = $1;
        `,[user.userId]);

        
        // Grab the right role_id from the database
        const roleKey : number = findUserResult.rows[0].role_id;
        let roleResult : QueryResult = await client.query(`
            SELECT *
            FROM roles 
            WHERE roles.id = $1
        `,[roleKey]);
        console.log("roleResult", roleResult);
        

        // Generate a Role object based on previously saved role type
        const originalRole : Role = roleResult.rows.map((r) => {
            return new Role(r.id, r.role_name);
        })[0];

        console.log("originalRole", typeof originalRole);
        
        
        // Create User object which reflects new column values
        // **Should return this at the end instead of repeating the process.** //
        let updatedUser : User = findUserResult.rows.map((u) => {
            return new User(
                u.id,
                (user.username || u.username),
                (user.password || u.password),
                (user.firstName || u.first_name),
                (user.lastName || u.last_name),
                (user.email || u.email),
                (user.role || originalRole) // only accepts legitmate Role(ish) objects
            );
        })[0];
        
        // UPDATE Query to edit those values
        let updateUserResult : QueryResult = await client.query(`
            UPDATE users
            SET username = $2, password = $3, first_name = $4, last_name = $5, email = $6
            WHERE id = $1;
        `,[
            updatedUser.userId, 
            updatedUser.username, 
            updatedUser.password, 
            updatedUser.firstName, 
            updatedUser.lastName, 
            updatedUser.email
        ]);

        // Requery for new user info
        const updatedUserResult : QueryResult = await client.query(`
            SELECT *
            FROM users
            WHERE id = $1;
        `,[user.userId]);

        // Create a User Object to return
        let finalUserObject : User = updatedUserResult.rows.map((u) => {
            return new User(
                u.id,
                u.username,
                u.password,
                u.first_name,
                u.last_name,
                u.email,
                (user.role || originalRole)
            );
        })[0];
        // Return the edited User
        return finalUserObject;
    } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    } finally {
        client && client.release();
    }
}

// Return a user to attach to the session or send appropriate response
export async function findUserByUsernamePassword(uname : string, pword : string) : Promise<User> {
    const client : PoolClient = await connectionPool.connect();
    try {
        const result : QueryResult = await client.query(`
            SELECT *, roles.id AS role_id_num, users.id AS user_id_num
            FROM users
            INNER JOIN roles ON users.role_id = roles.id
            WHERE username = $1 AND password = $2;
        `,[uname, pword]);

        const matchingUsers : User[] = result.rows.map(u => new User(
            u.user_id_num,
            u.username,
            u.password,
            u.first_name,
            u.last_name,
            u.email,
            (new Role(u.role_id_num, u.role_name))
        ));

        if (matchingUsers.length > 0) {
            return matchingUsers[0];
        } else {
            throw new Error('Username and password not matched to valid user.');
        }
        
    } catch (error) {
        throw new Error(`Could not successfully retrieve user by username and password: ${error.message}`);
    } finally {
        client && client.release();
    }
}