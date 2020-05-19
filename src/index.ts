import express from 'express';
import { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import { connectionPool } from './repository';
import { PoolClient, QueryResult } from 'pg';
import { userRouter } from './routers/userRouter';
import { reimbursementRouter } from './routers/reimbursementRouter';
import { loggingMiddleware } from './middleware/loggingMiddleware';

const app: Application = express();

app.use(bodyParser.json());

app.use(sessionMiddleware);
app.use(loggingMiddleware);

// ENDPOINTS
app.use('/users', userRouter);
app.use('/reimbursements', reimbursementRouter);

app.post('/login', (req: Request, res: Response) => {
    console.log("You're logged in");
    // res.json("You're logged in").
});


// OPEN PORT
app.listen(3000, () => {
    console.log('app has started');
    
    // TESTING DB CONNECTION
    connectionPool.connect().then((client: PoolClient) => {
        console.log('connected to database');
        client.query('SELECT * FROM reimbursements;').then((result: QueryResult) => {
            console.log(result.rows[0]);
        }).catch((err) => {
            console.log(err.message);
            
        })
    })
});