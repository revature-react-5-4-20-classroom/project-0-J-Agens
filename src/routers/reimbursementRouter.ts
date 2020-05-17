import express, { Router, Request, Response } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { getAllReimbursements } from '../repository/reimbursement-data-access';

export const reimbursementRouter : Router = express.Router();

reimbursementRouter.get('/', async (req : Request, res : Response) => {
    const reimbursements : Reimbursement[] = await getAllReimbursements();
    res.json(reimbursements);
});