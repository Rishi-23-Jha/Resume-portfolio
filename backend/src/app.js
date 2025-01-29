// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Check environment setup
console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

// Import routes
const resumeRoutes = require('./routes/resumeRoutes');

// Test OpenAI connection
const testOpenAI = async () => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 5
        });
        console.log("OpenAI connection test successful!");
        console.log("Test response:", response.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI connection test failed:", error.message);
        console.error("Error details:", {
            type: error.type,
            code: error.code,
            response: error.response?.data
        });
    }
};

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/test', (req, res) => {
    res.json({
        message: 'Backend server is running!',
        openaiKeyExists: !!process.env.OPENAI_API_KEY
    });
});

// Routes
app.use('/api/resume', resumeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Test OpenAI connection on server start
    testOpenAI();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});