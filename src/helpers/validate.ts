import { Request } from 'express';

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