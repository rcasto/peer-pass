import { SubmitSDPRequest, RetrieveSDPRequest } from '../schemas';

function isValidType(type: string): boolean {
    return type === 'offer' || type === 'answer';
}

// https://datatracker.ietf.org/doc/html/rfc4566#section-5
function isValidSDP(sdp: string): boolean {
    const normalizedSDP: string = sdp || '';
    return normalizedSDP.startsWith('v=') && normalizedSDP.endsWith('\r\n');
}

function isValidCode(code: string): boolean {
    return !!(code || '');
}

export function isValidSubmitSDPRequest(req: SubmitSDPRequest): boolean {
    const { type, sdp } = req.body;

    return isValidType(type) && isValidSDP(sdp);
}

export function isValidRetrieveSDPRequest(req: RetrieveSDPRequest): boolean {
    const { code } = req.body;

    return isValidCode(code);
}