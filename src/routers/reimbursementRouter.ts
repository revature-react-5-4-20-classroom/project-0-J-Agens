import express, { Router, Request, Response } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { getAllReimbursements, getReimbursementsByStatusId, getReimbursementsByAuthor, addReimbursement, updateReimbursement } from '../repository/reimbursement-data-access';
import { authRoleFactory } from '../middleware/authMiddleware';

export const reimbursementRouter : Router = express.Router();

reimbursementRouter.use(authRoleFactory(['employee', 'finance manager', 'admin']));

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
   
   let {author, amount, dateSubmitted, description, type} = req.body;
   // JSON comes back as a string, so converting types for author, amount, and type (06/02/2020 [project-1])
   author = parseInt(author);
   amount = parseFloat(amount);
   type = parseInt(type);

   if (author && amount && description && type) {
       const newRemb : Reimbursement = await addReimbursement(new Reimbursement(0, author, amount, dateSubmitted, 0, description, 0, 1, type));
       res.status(201);
       res.json(newRemb);
   } else {
       res.status(400).send('Please include the required fields');
   }
});

reimbursementRouter.use(authRoleFactory(['finance manager']));

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

reimbursementRouter.patch('/', async (req : Request, res : Response) => {
    /*
    Input format: (only reimbursementId is required)
        {
            "reimbursementId": number,
            "author": number,
            "amount": number,
            "dateSubmitted": "DD/MM/YYYY",
            "dateResolved": "DD/MM/YYYY",
            "description": string,
            "resolver": number,
            "status": number,
            "type": number
        }
    */

    let {
        reimbursementId,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type
    } = req.body;

    if (reimbursementId) {
        const remb = await updateReimbursement(new Reimbursement(
            reimbursementId,
            author,
            amount,
            dateSubmitted,
            dateResolved,
            description,
            resolver,
            status,
            type
        ));
        res.status(200);
        res.json(remb);
    } else {
        res.status(400).send('Failed to update reimbursement');
    }

});