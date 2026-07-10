import express from 'express';
import getGroqResponse from './services/groq.js';
import cors from 'cors';

const app = express();

app.use(cors()); // By default it will enable all the request to this backend.
app.use(express.json()); // middleware.

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;

app.post('/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Invalid messages format. It should be a non-empty array.' });
        }

        const response = await getGroqResponse(messages, model);

        res.status(200).json({ response: response });

    } catch (error) {
        console.log("Error in /chat route:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT);