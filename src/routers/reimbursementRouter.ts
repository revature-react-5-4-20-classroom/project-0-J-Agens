import express, { Router, Request, Response } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { getAllReimbursements, getReimbursementsByStatusId, getReimbursementsByAuthor, addReimbursement } from '../repository/reimbursement-data-access';

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

reimbursementRouter.post('/', async (req : Request, res : Response) => {
    /*
    // Input format:
    {
        "author": number,
        "amount": number,
        "dateSubmitted": string, // 'DD/MM/YYYY'
        "description": string,
        "type": number
    }
    */
   console.log('POST to /rems hit');
   
   let {author, amount, dateSubmitted, description, type} = req.body;
   if (author && amount && description && type) {
       await addReimbursement(new Reimbursement(0, author, amount, dateSubmitted, 0, description, 0, 1, type));
       res.sendStatus(201);
   } else {
       res.status(400).send('Please include the required fields');
   }
});