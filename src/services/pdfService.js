import fs from 'fs/promises';
import { createRequire } from 'module';
import resumeParser from './resumeParser.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

class PDFService {
    async extractText(filePath) {
        try {
            console.log('Reading PDF file:', filePath);
            const dataBuffer = await fs.readFile(filePath);

            const data = await pdfParse(dataBuffer);
            console.log('PDF parsed successfully');

            // Parse the extracted text into structured data
            const parsedData = resumeParser.parseText(data.text);

            return {
                structured: parsedData,
                raw: {
                    text: data.text,
                    numPages: data.numpages,
                    info: data.info
                }
            };
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            throw new Error(`Failed to extract text from PDF: ${error.message}`);
        }
    }

    async validatePDF(filePath) {
        try {
            const dataBuffer = await fs.readFile(filePath);
            await pdfParse(dataBuffer, { max: 1 }); // Just validate the first page
            return true;
        } catch (error) {
            console.error('Invalid PDF file:', error);
            return false;
        }
    }
}

export default new PDFService();