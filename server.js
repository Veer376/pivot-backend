import express from 'express';
import healthRouter from './src/routes/health.js';

const app = express(); // instance of the express.

app.use(healthRouter); // adding the healthRouter to the express app. This will allow the app to handle requests to the /health endpoint.


const PORT = process.env.PORT || 3000;

app.listen(PORT);