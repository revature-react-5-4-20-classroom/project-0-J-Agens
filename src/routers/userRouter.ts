import express, { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { getAllUsers, getUserById, updateUser } from '../repository/user-data-access';

export const userRouter : Router = express.Router();

userRouter.get('/', async (req: Request, res : Response) => {
    const users : User[] = await getAllUsers();
    res.json(users);
});

userRouter.get('/:id', async (req : Request, res : Response) => {
    const id = +req.params.id;
    const user : User[] = await getUserById(id);
    if(isNaN(id)) {
        res.status(400).send('Must include numeric in path');
    } else {
        res.json(user);
    }
});

userRouter.patch('/', aysnc (req : Request, res : Response) => {
    let {id, username, password, first_name, last_name, email, role_id} = req.body;
    if (id) {
        await updateUser(new User(id, username, password, first_name, last_name, email, roleId));
    } else {
        res.status(400).send('Please include include a user id.')
    }
    
});