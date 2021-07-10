import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import peerApi from './peerApi';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20,                  // limit each IP to 20 requests per windowMs
});
const openapiSpecification = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'peer-pass',
            description: 'An API to facilitate in connecting peers.',
            version: '1.0.0',
        },
    },
    apis: ['./src/peerApi.ts'],
});

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/api/peer', peerApi);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});