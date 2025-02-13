// src/services/pdfService.js
import fs from 'fs/promises';
import { createRequire } from 'module';
import openaiService from './openaiService.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

class PDFService {
    async extractText(filePath) {
        try {
            console.log('Reading PDF file:', filePath);
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdfParse(dataBuffer);

            // Use OpenAI to parse the text
            const parsedData = await openaiService.parseResume(data.text);

            return {
                success: true,
                structured: parsedData
            };
        } catch (error) {
            console.error('PDF extraction error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new PDFService();