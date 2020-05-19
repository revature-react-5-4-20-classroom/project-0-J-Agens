import express, { Request, Response, NextFunction } from 'express';

// export const authAdminMiddleware = (req : Request, res : Response, next : NextFunction) => {
//     if (!req.session || !req.session.user) {
//         res.status(401).send('Please login');
//     } else if (req.session.user.role.role !== 'Admin') {
//         res.status(403).send('You are not authorized');
//     } else {
//         next();
//     }
// }

export function authRoleFactory(roles : string[]) {
    return (req : Request, res : Response, next : NextFunction) => {
        if (!req.session || !req.session.user) {
            res.status(401).send('Please login');
        } else {
            let allowed = false;
            for(let role of roles) {
                if (req.session.user.role.role === role) {
                    allowed = true;
                }
            }
            if(allowed) {
                next();
            } else {
                res.status(401).send({"message": "The incoming token has expired"});
            }
        }
        
    }
}

// let GET requests in from anyone, let POST requests in if the user is logged in
export const authReadOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        next();
    } else if(!req.session || !req.session.user) {
        res.status(401).send(`Cannot ${req.method} unless you first login`);
    } else {
        next();
    }
}