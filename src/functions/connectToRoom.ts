import { Request, Response } from 'express';
import { isValidRequest } from '../helpers/validate';

export function connectToRoom(req: Request, res: Response) {
    if (!isValidRequest(req)) {
        res.status(400).end();
        return;
    }

    res.send(`Hello World!`);
}