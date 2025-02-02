import dotenv from 'dotenv';
import OpenAI from 'openai';
import winston from 'winston';
import { promises as fs } from 'fs';

// Load environment variables
dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

// Configure Winston Logger specifically for OpenAI testing
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...rest }) => {
            return JSON.stringify({
                timestamp,
                level,
                message,
                ...rest
            }, null, 2);
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'logs/openai-test.log'
        })
    ]
});

// Initialize OpenAI with error handling
let openai;
try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    logger.info('OpenAI client initialized successfully');
} catch (error) {
    logger.error('Failed to initialize OpenAI client:', error);
    process.exit(1);
}

// Test function with timeout
async function testOpenAI(timeout = 30000) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OpenAI API request timed out')), timeout);
    });

    try {
        logger.info('Starting OpenAI integration test');

        // Sample resume text for testing
        const sampleText = `
            John Doe
            Software Engineer
            
            Skills:
            JavaScript, Python, React, Node.js
            
            Experience:
            Senior Developer at Tech Corp (2020-Present)
            - Led team of 5 developers
            - Implemented microservices architecture
            
            Education:
            BS Computer Science, XYZ University (2016-2020)
        `;

        // Test prompt
        const prompt = `
            Please analyze this resume text and extract the following information in JSON format:
            - Name
            - Current Role
            - Skills (as an array)
            - Experience (as an array of objects with company, role, and duration)
            - Education (as an array)
            
            Resume text:
            ${sampleText}
        `;

        logger.info('Sending request to OpenAI API');

        // Race between API call and timeout
        const response = await Promise.race([
            openai.chat.completions.create({
                model: "gpt-4-0125-preview",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.2,
                max_tokens: 1000
            }),
            timeoutPromise
        ]);

        // Log successful response
        logger.info('Received response from OpenAI', {
            usage: response.usage,
            model: response.model,
            responseLength: response.choices[0].message.content.length
        });

        // Log the actual content separately for better readability
        logger.info('OpenAI Response Content:', {
            content: response.choices[0].message.content
        });

        // Try to parse the response as JSON
        try {
            const parsedResponse = JSON.parse(response.choices[0].message.content);
            logger.info('Successfully parsed response as JSON', {
                parsedResponse
            });
        } catch (error) {
            logger.warn('Response was not valid JSON', {
                error: error.message
            });
        }

        return response;

    } catch (error) {
        if (error.message === 'OpenAI API request timed out') {
            logger.error('OpenAI API request timed out');
        } else {
            logger.error('Error during OpenAI test:', {
                error: error.message,
                code: error.code,
                type: error.type,
                stack: error.stack
            });
        }
        throw error;
    }
}

// Execute the test
async function runTest() {
    try {
        logger.info('Starting OpenAI integration test suite');

        // Create logs directory if it doesn't exist
        await fs.mkdir('logs', { recursive: true });

        // Run the test
        const result = await testOpenAI();

        logger.info('Test completed successfully', {
            modelUsed: result.model,
            completionTokens: result.usage?.completion_tokens,
            promptTokens: result.usage?.prompt_tokens
        });

    } catch (error) {
        logger.error('Test suite failed:', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
}

// Run the test suite
runTest().then(() => {
    logger.info('Test suite completed');
}).catch((error) => {
    logger.error('Test suite failed:', error);
    process.exit(1);
});