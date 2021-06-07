import { Request } from 'express';
import { CreateRoomRequest } from '../schemas';

export function isValidRequest(req: Request): boolean {
    if (req.method !== 'POST') {
        return false;
    }
    
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
        return false;
    }

    const { type } = req.body || {};
    if (typeof type !== 'string') {
        return false;
    }

    return true;
}

export function isValidCreateRoomRequest(req: Request): req is CreateRoomRequest {
    if (req.method !== 'POST') {
        return false;
    }

    if (typeof req.body !== 'object') {
        return false;
    }

    if (typeof req.body.name !== 'string') {
        return false;
    }
    if (req.body.password && typeof req.body.password !== 'string') {
        return false;
    }
    if (typeof req.body.offer !== 'string') {
        return false;
    }

    return true;
}