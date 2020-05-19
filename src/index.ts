import express from 'express';
import { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import { connectionPool } from './repository';
import { PoolClient, QueryResult } from 'pg';
import { userRouter } from './routers/userRouter';
import { reimbursementRouter } from './routers/reimbursementRouter';
import { findUserByUsernamePassword } from './repository/user-data-access';
import { User } from './models/User';

const app: Application = express();

app.use(bodyParser.json());

app.use(sessionMiddleware);

// ENDPOINTS
app.use('/users', userRouter);
app.use('/reimbursements', reimbursementRouter);

app.get('/views', (req: Request, res: Response) => {
    console.log("req.session is:", req.session);
    if(req.session && req.session.views) {
        req.session.views++
        res.send(`Reached this endpoint ${req.session.views} times`);
    } else if(req.session){
        req.session.views = 1
        res.send('Reached the endpoint for the first time');
    } else {
        res.send('Reach the views endpoint without a session');
    }
})

app.post('/login', async (req : Request, res : Response) => {
    // We're assuming users login with username and password inside a JSON object
    // get that data:
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(400).send({"message": "invalid credentials"});
    } else {
        try {
            const user : User = await findUserByUsernamePassword(username, password);
            if (req.session) {
                req.session.user = user;
            }
            res.json(user);
        } catch (err) {
            console.log(err.message);
            res.status(401).send('Failed to authenticate username and password');
        }
    }
});


// OPEN PORT
app.listen(3000, () => {
    console.log('app has started');
    
    // TESTING DB CONNECTION
    connectionPool.connect().then((client: PoolClient) => {
        console.log('connected to database');
        client.query('SELECT * FROM reimbursements;').then((result: QueryResult) => {
            console.log('Test query => ', result.rows[0]);
        }).catch((err) => {
            console.log(err.message);
            
        })
    })
});