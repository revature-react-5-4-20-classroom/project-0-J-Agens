import { Reimbursement } from '../models/Reimbursement';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';

const rems : string = 'reimbursements';

export async function getAllReimbursements() : Promise<Reimbursement[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        // Sorted by most recent first
        let result : QueryResult = await client.query(`
            SELECT ${rems}.id, 
            ${rems}.author, 
            ${rems}.amount, 
            ${rems}.date_submitted, 
            ${rems}.date_resolved, 
            ${rems}.description, 
            ${rems}.resolver, 
            ${rems}.status, 
            ${rems}.reimbursement_type
            FROM reimbursements
            ORDER BY ${rems}.date_submitted DESC;
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
        // Sorted by most recent first
        let result : QueryResult = await client.query(`
            SELECT *
            FROM ${rems}
            WHERE ${rems}.status = $1
            ORDER BY ${rems}.date_submitted DESC;
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
        // Sorted by most recent first
        let result : QueryResult = await client.query(`
            SELECT *
            FROM ${rems}
            WHERE ${rems}.author = $1
            ORDER BY ${rems}.date_submitted DESC;
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

export async function addReimbursement(rem : Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    try {
        let insertRembResult : QueryResult = await client.query(`
            INSERT INTO reimbursements
            VALUES(DEFAULT, $1, $2, TO_DATE($3, 'DD/MM/YYYY'), NULL, $4, NULL, 1, $5);
        `,[
            rem.author, 
            rem.amount, 
            rem.dateSubmitted, 
            rem.description, 
            rem.type
        ]);

        let result : QueryResult = await client.query(`
            SELECT *
            FROM reimbursements
            ORDER BY date_submitted DESC
            LIMIT 1;
        `);

        const newRem = result.rows.map((r) => {
            return new Reimbursement(
                r.id, 
                r.author, 
                r.amount, 
                r.date_submitted, 
                (r.date_resolved || 0), 
                r.description, 
                (r.resolver || 0), 
                r.status, 
                r.type
            );
        })[0];
        return newRem;
    } catch (error) {
        throw new Error(`Failed to add a new reimbursement: ${error.message}`);
    } finally {
        client && client.release();
    }
}

export async function updateReimbursement(rem : Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    try {
        return rem
    } finally {
        client && client.release();
    }
}