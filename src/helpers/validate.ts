import { SubmitSDPRequest, RetrieveSDPRequest } from '../schemas';
import { ONE_TIME_CODE_LENGTH } from './util';

const MAX_ALLOWED_BYTE_SIZE_FOR_SDP: number = 1024 * 10; // 10KB for SDP

function isValidType(type: string): boolean {
    return type === 'offer' || type === 'answer';
}

// https://datatracker.ietf.org/doc/html/rfc4566#section-5
function isValidSDP(sdp: string): boolean {
    const normalizedSDP: string = sdp || '';
    const sdpByteLength: number = Buffer.byteLength(normalizedSDP, 'utf8');

    return (
        normalizedSDP.startsWith('v=') &&
        normalizedSDP.endsWith('\r\n') &&
        sdpByteLength <= MAX_ALLOWED_BYTE_SIZE_FOR_SDP
    );
}

function isValidCode(code: string): boolean {
    return (code || '').length !== ONE_TIME_CODE_LENGTH;
}

export function isValidSubmitSDPRequest(req: SubmitSDPRequest): boolean {
    const { type, sdp } = req.body;

    return isValidType(type) && isValidSDP(sdp);
}

export function isValidRetrieveSDPRequest(req: RetrieveSDPRequest): boolean {
    const { code } = req.body;

    return isValidCode(code);
}