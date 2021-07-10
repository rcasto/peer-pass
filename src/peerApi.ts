import express, { Response } from 'express';
import { generateUniqueOneTimeCode, handleError } from './helpers/util';
import { isValidRetrieveSDPRequest, isValidSubmitSDPRequest } from './helpers/validate';
import { RetrieveSDPRequest, RetrieveSDPResponse, SubmitSDPRequest, SubmitSDPResponse } from './schemas';
import { BlobCache } from './storage';

const router = express.Router();

function handleErrorResponse(res: Response, err: any): void {
    handleError(err);
    res.status(500).end();
}

/**
 * @openapi
 * /api/peer/submit:
 *   post:
 *     description: Submit offer or answer SDP to be stored for peer to pick up with one time code.
 *     responses:
 *       200:
 *         description: Returns an object containing a one time code, used to access stored offer or answer SDP.
 *         content:
 *             application/json:
 *                 schema:
 *                     type: object
 *                     properties:
 *                         code:
 *                             type: string
 *       400:
 *         description: Invalid request received.
 *       500:
 *         description: An internal server error occurred.
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     type: object
 *                     properties:
 *                         type:
 *                             type: string
 *                             enum: [offer, answer]
 *                         sdp:
 *                             type: string
 * 
 */
router.post('/submit', async (req: SubmitSDPRequest, res) => {
    try {
        if (!isValidSubmitSDPRequest(req)) {
            res.status(400).end();
            return;
        }

        const uniqueCode = await generateUniqueOneTimeCode(BlobCache.has);
        await BlobCache.set(uniqueCode, req.body);

        const submitSDPResponse: SubmitSDPResponse = {
            code: uniqueCode,
        };
        res.json(submitSDPResponse);
    } catch (err) {
        handleErrorResponse(res, err);
    }
});

/**
 * @openapi
 * /api/peer/retrieve:
 *   post:
 *     description: Retrieve offer or answer SDP using one time code from peer.
 *     responses:
 *       200:
 *         description: Returns the offer or answer SDP object stored by peer.
 *         content:
 *             application/json:
 *                 schema:
 *                     type: object
 *                     properties:
 *                         type:
 *                             type: string
 *                             enum: [offer, answer]
 *                         sdp:
 *                             type: string
 *       400:
 *         description: Invalid request received.
 *       404:
 *         description: No offer or answer SDP found for one time code, or one time code has expired.
 *       500:
 *         description: An internal server error occurred.
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     type: object
 *                     properties:
 *                         code:
 *                             type: string
 */
router.post('/retrieve', async (req: RetrieveSDPRequest, res) => {
    try {
        if (!isValidRetrieveSDPRequest(req)) {
            res.status(400).end();
            return;
        }

        const { code } = req.body;
        const sdpCacheEntry = await BlobCache.get(code);

        if (!sdpCacheEntry) {
            res.status(404).end();
            return;
        }

        // code has now been used, remove entry from cache
        await BlobCache.del(code);

        const retrieveSDPResponse: RetrieveSDPResponse = {
            type: sdpCacheEntry.type,
            sdp: sdpCacheEntry.sdp,
        };
        res.json(retrieveSDPResponse);
    } catch (err) {
        handleErrorResponse(res, err);
    }
});

export default router;
