import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import peerApi from './peerApi';

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50,                  // limit each IP to 50 requests per windowMs
});

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use('/api/peer', peerApi);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});