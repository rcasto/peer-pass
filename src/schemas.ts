import { Request } from 'express';

interface RoomInfo {
    name: string;
    password?: string;
}

export interface CreateRoomRequest extends Request {
    body: CreateRoomRequestBody;
}

export interface CreateRoomRequestBody extends RoomInfo {
    offer: string;
}

export interface ConnectToRoomRequest extends Request {
    body: ConnectToRoomRequestBody;
}

export interface ConnectToRoomRequestBody extends RoomInfo {
    type: 'getOffer' | 'getAnswer' | 'addAnswer';
    data: string;
}