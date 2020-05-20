import { Reimbursement } from '../models/Reimbursement';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';

export async function getAllReimbursements() : Promise<Reimbursement[]> {
    let client : PoolClient = await connectionPool.connect();
    try {
        // Sorted by most recent first
        let result : QueryResult = await client.query(`
            SELECT *
            FROM reimbursements
            ORDER BY date_submitted DESC;
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
            FROM reimbursements
            WHERE status = $1
            ORDER BY date_submitted DESC;
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
            FROM reimbursements
            WHERE author = $1
            ORDER BY date_submitted DESC;
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

        const newRem : Reimbursement = result.rows.map((r) => {
            return new Reimbursement(
                r.id, 
                r.author, 
                r.amount, 
                r.date_submitted, 
                (r.date_resolved || 0), 
                r.description, 
                (r.resolver || 0), 
                r.status, 
                r.reimbursement_type
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
        // Grab the right reimbursement row by the remimbursementId
        const rembResult : QueryResult = await client.query(`
            SELECT *
            FROM reimbursements
            WHERE id = $1;
        `,[rem.reimbursementId]);

        const newRem : Reimbursement = rembResult.rows.map(r => new Reimbursement(
            r.id, 
            r.author, // Cannot change author
            (rem.amount || r.amount), 
            r.date_submitted, // Cannot change date_submitted
            (rem.dateResolved || r.date_resolved), 
            (rem.description || r.description), 
            (rem.resolver || r.resolver), 
            (rem.status || r.status), 
            (rem.type || r.reimbursement_type)
        ))[0];
        
        const updateRembResult : QueryResult = await client.query(`
            UPDATE reimbursements
            SET amount = $2, 
                date_resolved = TO_DATE($3, 'DD/MM/YYYY'),
                description = $4,
                resolver = $5,
                status = $6,
                reimbursement_type = $7
            WHERE id = $1;
        `,[
            newRem.reimbursementId,
            newRem.amount,
            newRem.dateResolved,
            newRem.description,
            newRem.resolver,
            newRem.status,
            newRem.type
        ]);

        // Query the updated reimbursement for possible remapping if needed
        const newRembResult : QueryResult = await client.query(`
            SELECT *
            FROM reimbursements
            WHERE id = $1;
        `,[rem.reimbursementId]);

        return newRem;
    } catch(error) {
        throw new Error(`Failed to update reimbursement ${rem.reimbursementId}: ${error.message}`);
    } finally {
        client && client.release();
    }
}