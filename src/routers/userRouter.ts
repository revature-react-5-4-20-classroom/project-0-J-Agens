import express, { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { getAllUsers, getUserById, updateUser } from '../repository/user-data-access';
import { Role } from '../models/Role';

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

userRouter.patch('/', async (req : Request, res : Response) => {
    let {userId, username, password, firstName, lastName, email, role} = req.body;
    console.log(`id: ${userId}, password: ${password}, firstName: ${firstName}`);
    
    if (userId) {
        let user = await updateUser(new User(userId, username, password, firstName, lastName, email, role));
        console.log(`finalUser.username is: ${user.username}`);
        
        res.json(user);
    } else {
        res.status(400).send('Please include the appropriate fields to update user. Must include id');
    }
});

// let {id, username, password, first_name, last_name, email, role_id} = req.body;
// if (id) {
//     await updateUser(new User(id, username, password, first_name, last_name, email, new Role(role_id, "employee")))
// } else {
//     res.status(400).send('Please include include a user id.')
// }