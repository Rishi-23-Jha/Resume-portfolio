import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import uploadRouter from './routes/upload.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', uploadRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});