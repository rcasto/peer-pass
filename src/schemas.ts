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

export interface IStorage {
    get: (key: string) => Promise<SDPData | null>;
    set: (key: string, value: SDPData) => Promise<void>;
    del: (key: string) => Promise<boolean>;
    has: (key: string) => Promise<boolean>;
}