import { Reimbursement } from '../models/Reimbursement';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';

export async function getAllReimbursements() : Promise<Reimbursement[]> {
    let client : PoolClient = await connectionPool.connect();
    const rems : String = 'reimbursements';
    try {
        let result : QueryResult = await client.query(`
            SELECT ${rems}.id, ${rems}.author, ${rems}.amount, ${rems}.date_submitted, ${rems}.date_resolved, 
            ${rems}.description, ${rems}.resolver, ${rems}.status, ${rems}.reimbursement_type
            FROM reimbursements;
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