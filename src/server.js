import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(studentRoutes);

app.use((req, res) => res.status(404).type('text/plain; charset=utf-8').send('Not Found'));

app.listen(port, () => console.log(`Server running on port ${port}. Press Ctrl+C to stop.`));