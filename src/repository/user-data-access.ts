import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
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

export async function updateUser() {
    
}