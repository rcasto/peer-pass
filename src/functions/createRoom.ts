import { Request, Response } from 'express';

/**
 * Proposed room schema:
 * {
 *     name: string;
 *     password?: string;
 *     offers: string[];
 * }
 */

/**
 * Questions:
 * - How does a room remain active?
 * - How is contention resolved for offers? Blob storage won't handle this. 2 peers could grab the same offer.
 */
export function createRoom(req: Request, res: Response) {
}