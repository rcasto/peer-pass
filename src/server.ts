import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createSDPCache, SDP_ENTRY_TTL_IN_SECONDS } from './cache';
import { generateUniqueOneTimeCode } from './helpers/util';
import { isValidRetrieveSDPRequest, isValidSubmitSDPRequest } from './helpers/validate';
import { Cache, RetrieveSDPRequest, RetrieveSDPResponse, SDPData, SubmitSDPRequest, SubmitSDPResponse } from './schemas';

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50,                  // limit each IP to 50 requests per windowMs
});
const sdpCache: Cache<SDPData> = createSDPCache();

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.post('/api/peer/submit', (req: SubmitSDPRequest, res) => {
    if (!isValidSubmitSDPRequest(req)) {
        res.status(400).end();
        return;
    }

    const result: SubmitSDPResponse = {
        code: generateUniqueOneTimeCode(sdpCache),
    };

    sdpCache.set(result.code, req.body, SDP_ENTRY_TTL_IN_SECONDS);

    res.json(result);
});

app.post('/api/peer/retrieve', (req: RetrieveSDPRequest, res) => {
    if (!isValidRetrieveSDPRequest(req)) {
        res.status(400).end();
        return;
    }

    const { code } = req.body;
    const sdpCacheEntry = sdpCache.get(code);

    if (!sdpCacheEntry) {
        res.status(404).end();
        return;
    }

    // code has now been used, remove entry from cache
    sdpCache.del(code);

    const result: RetrieveSDPResponse = sdpCacheEntry;
    res.json(result);
});

// https://cloud.google.com/appengine/docs/standard/nodejs/configuring-warmup-requests#creating_your_handler
app.get('/_ah/warmup', (req, res) => {
    res.status(200).end();
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});