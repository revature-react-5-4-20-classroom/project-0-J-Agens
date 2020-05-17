import express, { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { getAllUsers } from '../repository/user-data-access';

export const userRouter : Router = express.Router();

userRouter.get('/', async (req: Request, res : Response) => {
    const users : User[] = await getAllUsers();
    res.json(users);
});