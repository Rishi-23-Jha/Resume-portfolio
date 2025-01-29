// src/services/resumeParser.js
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

class ResumeParser {
    constructor() {
        // No need for bindings as we're using class methods
    }

    // Define class methods using proper syntax
    async parseFile(file) {
        try {
            console.log('Starting to parse file:', file.originalname);
            console.log('File mimetype:', file.mimetype);

            let text = '';

            // Check if file exists
            if (!fs.existsSync(file.path)) {
                throw new Error('File not found at path: ' + file.path);
            }

            // Extract text based on file type
            if (file.mimetype === 'application/pdf') {
                console.log('Processing PDF file');
                const dataBuffer = fs.readFileSync(file.path);
                const pdfData = await pdfParse(dataBuffer);
                text = pdfData.text;
            } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                console.log('Processing DOCX file');
                const result = await mammoth.extractRawText({ path: file.path });
                text = result.value;
            } else {
                throw new Error('Unsupported file type');
            }

            console.log('Text extracted successfully, length:', text.length);

            // Process with OpenAI
            console.log('Sending to OpenAI for processing...');
            const parsedData = await this.processWithGPT(text);

            return parsedData;
        } catch (error) {
            console.error('Error in parseFile:', error);
            throw error;
        }
    }

    async processWithGPT(text) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Extract resume information in a structured format."
                    },
                    {
                        role: "user",
                        content: `Parse this resume text into JSON format:
                        {
                            "basicInfo": {
                                "name": "",
                                "email": "",
                                "phone": "",
                                "location": ""
                            },
                            "skills": [],
                            "experience": [
                                {
                                    "company": "",
                                    "position": "",
                                    "duration": "",
                                    "description": ""
                                }
                            ],
                            "education": [
                                {
                                    "institution": "",
                                    "degree": "",
                                    "year": ""
                                }
                            ],
                            "projects": [
                                {
                                    "name": "",
                                    "description": "",
                                    "technologies": []
                                }
                            ]
                        }

                        Text: ${text.substring(0, 2000)}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000
            });

            console.log('OpenAI response received');
            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('OpenAI processing error:', error);
            throw new Error('Failed to process with OpenAI: ' + error.message);
        }
    }
}

// Export a single instance
module.exports = new ResumeParser();