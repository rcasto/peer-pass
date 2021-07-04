import express from 'express';
import helmet from 'helmet';
import { isValidRetrieveSDPRequest, isValidSubmitSDPRequest } from './helpers/validate';
import { RetrieveSDPRequest, SubmitSDPRequest } from './schemas';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());

app.post('/api/peer/submit', (req: SubmitSDPRequest, res) => {
    if (!isValidSubmitSDPRequest(req)) {
        res.status(400).end();
        return;
    }

    const { type, sdp } = req.body;

    console.log(type, sdp);

    res.status(200).end();
});

app.post('/api/peer/retrieve', (req: RetrieveSDPRequest, res) => {
    if (!isValidRetrieveSDPRequest(req)) {
        res.status(400).end();
        return;
    }

    const { code } = req.body;
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});