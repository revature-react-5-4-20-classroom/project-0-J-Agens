import express, { Router, Request, Response } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { getAllReimbursements, getReimbursementsByStatusId, getReimbursementsByAuthor } from '../repository/reimbursement-data-access';

export const reimbursementRouter : Router = express.Router();

reimbursementRouter.get('/', async (req : Request, res : Response) => {
    const reimbursements : Reimbursement[] = await getAllReimbursements();
    res.json(reimbursements);
});

reimbursementRouter.get('/status/:id', async (req : Request, res : Response) => {
    const id = +req.params.id;
    const reimbursement : Reimbursement[] = await getReimbursementsByStatusId(id);
    res.json(reimbursement);
    
});

reimbursementRouter.get('/author/userId/:authorId', async (req : Request, res : Response) => {
    const id = +req.params.authorId;
    const reimbursements : Reimbursement[] = await getReimbursementsByAuthor(id);
    res.json(reimbursements);
})