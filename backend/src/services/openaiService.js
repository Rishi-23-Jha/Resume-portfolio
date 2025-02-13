// src/services/openaiService.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
    async parseResume(text) {
        try {
            console.log('Starting OpenAI resume parsing');

            const prompt = `Extract structured information from this resume:
            Resume text:
            ${text}
            
            Provide the response in this exact JSON format:
            {
                "personalInfo": {
                    "name": "",
                    "email": "",
                    "phone": "",
                    "location": "",
                    "linkedin": ""
                },
                "experience": [{
                    "role": "",
                    "company": "",
                    "duration": "",
                    "location": "",
                    "responsibilities": []
                }],
                "skills": [],
                "projects": [{
                    "title": "",
                    "description": "",
                    "technologies": []
                }]
            }`;

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional resume parser. Extract information accurately and structure it properly."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                response_format: { type: "json_object" }
            });

            const parsedData = JSON.parse(completion.choices[0].message.content);
            console.log('OpenAI parsing successful');
            return parsedData;

        } catch (error) {
            console.error('OpenAI parsing error:', error);
            throw error;
        }
    }
}

export default new OpenAIService();