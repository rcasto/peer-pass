import express from 'express';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());

app.post('/api/peer/submit', (req, res) => {
    const { type, sdp } = req.body;
});

app.post('/api/peer/retrieve', (req, res) => {

});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});