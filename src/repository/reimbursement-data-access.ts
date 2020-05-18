import { Reimbursement } from '../models/Reimbursement';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';

const rems : string = 'reimbursements';

export async function getAllReimbursements() : Promise<Reimbursement[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        let result : QueryResult = await client.query(`
            SELECT ${rems}.id, ${rems}.author, ${rems}.amount, ${rems}.date_submitted, ${rems}.date_resolved, 
            ${rems}.description, ${rems}.resolver, ${rems}.status, ${rems}.reimbursement_type
            FROM reimbursements
            ORDER BY ${rems}.date_submitted;
        `);
        return result.rows.map((r) => {
            return new Reimbursement(
                r.id, 
                r.author, 
                r.amount, 
                r.date_submitted, 
                r.date_resolved, 
                r.description,
                r.resolver,
                r.status,
                r.reimbursement_type
            )
        });
    } catch (error) {
        throw new Error(`Failed to query for all Reimbursements: ${error.message}`)
    } finally {
        client && client.release();
    }
}

export async function getReimbursementsByStatusId(statusId : number) : Promise<Reimbursement[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        let result : QueryResult = await client.query(`
            SELECT *
            FROM ${rems}
            WHERE ${rems}.status = $1
            ORDER BY ${rems}.date_submitted;
        `, [statusId]);
        return result.rows.map((r) => {
            return new Reimbursement(
                r.id,
                r.author,
                r.amount,
                r.date_submitted,
                r.date_resolved,
                r.description,
                r.resolver,
                r.status,
                r.reimbursement_type
            );
        });
    } catch (error) {
        throw new Error(`Failed to query for reimbursement by id: ${error.message}`);
    } finally {
        client && client.release();
    }
}

export async function getReimbursementsByAuthor(authorId : number) : Promise<Reimbursement[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        let result : QueryResult = await client.query(`
            SELECT *
            FROM ${rems}
            WHERE ${rems}.author = $1
            ORDER BY ${rems}.date_submitted;
        `, [authorId]);
        return result.rows.map((r) => {
            return new Reimbursement(
                r.id,
                r.author,
                r.amount,
                r.date_submitted,
                r.date_resolved,
                r.description,
                r.resolver,
                r.status,
                r.reimbursement_type
            );
        });
    } catch (error) {
        throw new Error(`Failed to query reimbursements by author id: ${error.message}`);
    } finally {
        client && client.release();
    }
}