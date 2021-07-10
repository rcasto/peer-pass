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

router.post('/submit', async (req: SubmitSDPRequest, res) => {
    try {
        if (!isValidSubmitSDPRequest(req)) {
            res.status(400).end();
            return;
        }

        const uniqueCode = await generateUniqueOneTimeCode(BlobCache.has);
        if (!uniqueCode) {
            res.status(500).end();
            return;
        }

        const setResult = await BlobCache.set(uniqueCode, req.body);
        if (!setResult) {
            res.status(500).end();
            return;
        }

        const submitSDPResponse: SubmitSDPResponse = {
            code: uniqueCode,
        };
        res.json(submitSDPResponse);
    } catch (err) {
        handleErrorResponse(res, err);
    }
});

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
