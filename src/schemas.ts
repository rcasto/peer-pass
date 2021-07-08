import { Request } from 'express';

export interface WrapErrorInput {
    source: Function;
    message: string;
    err: Error;
}

export interface ErrorWrapper {
    err: Error;
    source: string;
    message: string;
}

export interface SDPData {
    type: 'offer' | 'answer';
    sdp: string;
}

export interface CodeExchange {
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