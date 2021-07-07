import { Request } from 'express';

export interface Cache<T> {
    get: (key: string) => T | undefined;
    set: (key: string, value: T, ttl: number) => boolean;
    del: (key: string) => boolean;
}

export interface SDPData {
    type: 'offer' | 'answer';
    sdp: string;
}

export interface SDPDataWithExpiry extends SDPData {
    expiresAt: number;
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