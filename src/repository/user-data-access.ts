import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';

export async function getAllUsers() : Promise<User[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        let result : QueryResult = await client.query(
            `SELECT users.id, users.username, users.password, users.first_name, users.last_name, users.email, roles.role_name
            FROM users
            INNER JOIN roles ON users.role_id = roles.id;
            `
            );
            return result.rows.map((u) => {
                return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email)
            });
    } catch (error) {
        throw new Error(`Failed to query for all users: ${error.message}`);
    } finally {
        client && client.release();
    }
    return [];
}