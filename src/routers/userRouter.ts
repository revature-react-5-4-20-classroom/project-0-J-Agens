import express, { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { getAllUsers, getUserById, updateUser } from '../repository/user-data-access';
import { authRoleFactory } from '../middleware/authMiddleware';

export const userRouter : Router = express.Router();

// finance managers can view all users and individual users by id
// userRouter.use(authRoleFactory(['finance manager']));

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

// admins can edit users
// userRouter.use(authRoleFactory(['admin']));

userRouter.patch('/', async (req : Request, res : Response) => {
    let {userId, username, password, firstName, lastName, email, role} = req.body;
    
    if (userId) {
        const user : User = await updateUser(new User(userId, username, password, firstName, lastName, email, role));
        res.json(user);
    } else {
        res.status(400).send('Please include the appropriate fields to update user. Must include id');
    }
});
