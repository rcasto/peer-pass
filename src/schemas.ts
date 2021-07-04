import { Request } from 'express';

interface SDPData {
    type: 'offer' | 'answer';
    sdp: string;
}

interface CodeExchange {
    code: string;
}

export interface SubmitSDPRequest extends Request {
    body: SDPData;
}

export interface SubmitSDPResponse extends CodeExchange { }

export interface RetrieveSDPRequest extends Request {
    body: CodeExchange;
}

export interface RetrieveSDPResponse extends SDPData { }