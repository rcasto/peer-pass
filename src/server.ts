import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { generateUniqueOneTimeCode } from './helpers/util';
import { isValidRetrieveSDPRequest, isValidSubmitSDPRequest } from './helpers/validate';
import { RetrieveSDPRequest, RetrieveSDPResponse, SubmitSDPRequest, SubmitSDPResponse } from './schemas';
import { BlobCache } from './storage';

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50,                  // limit each IP to 50 requests per windowMs
});

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.post('/api/peer/submit', async (req: SubmitSDPRequest, res) => {
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
});

app.post('/api/peer/retrieve', async (req: RetrieveSDPRequest, res) => {
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
});

// https://cloud.google.com/appengine/docs/standard/nodejs/configuring-warmup-requests#creating_your_handler
app.get('/_ah/warmup', (req, res) => {
    res.status(200).end();
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});