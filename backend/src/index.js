import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { router as uploadRouter } from './routes/upload.js';  // Changed this line

config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/resume', uploadRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        environment: process.env.NODE_ENV
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});