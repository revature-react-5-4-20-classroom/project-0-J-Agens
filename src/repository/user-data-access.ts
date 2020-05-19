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

        // Accept a role object with just a role field as input
        // Grab the right role_id from the database
        let roleResult : QueryResult = await client.query(`
            SELECT *
            FROM roles 
            WHERE roles.role_name = $1
        `,[user.role.role]);

        // Generate a Role object to be inserted into the updated User object.
        const originalRole : Role = roleResult.rows.map((r) => {
            return new Role(r.id, r.role_name);
        })[0];
        
        // Create User object which mirrors the row as it exists in the database
        // Can be used in a later refactor, not implemented yet.
        let updateableUser : User = findUserResult.rows.map((u) => {
            return new User(
                u.id,
                u.username,
                u.password,
                u.first_name,
                u.last_name,
                u.email,
                originalRole
            );
        })[0];


        // UPDATE Query
        let updateUserResult : QueryResult = await client.query(`
            UPDATE users
            SET username = $1, password = $2, first_name = $3, last_name = $4, email = $5
            WHERE id = $6;
        `,[user.username, user.password, user.firstName, user.lastName, user.email, user.userId]);

        // Create a User Object to return
        let finalUserObject : User = updateUserResult.rows.map((u) => {
            return new User(
                u.id,
                u.username,
                u.password,
                u.first_name,
                u.last_name,
                u.email,
                originalRole
            );
        })[0];

        return finalUserObject;
    } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    } finally {
        client && client.release();
    }
}