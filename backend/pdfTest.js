import fs from 'fs';
import PdfParse from './PdfParse';
import winston from 'winston';
// Enhanced logger configuration
const logger = winston.createLogger({
    level: 'info',
    format:
        winston.format.json()
    ,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'combined.log'
        }),
    ]
});

const pdfFilePath = 'sample.pdf'

const parsePdf = async (filePath) => {
    try {
        const steam = fs.createReadStream(filePath);
        const data = await pdfParse(stream);
        logger.info('Extracted Text:', { text: data.text });
        return data.text;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            logger.error('File not found', { filePath });
        } else {
            logger.error('Error parsing PDF:', { error });
        }
        throw error;
    }
};

parsePdf(pdfFilePath)
    .then((text) => {
        console.log('PDF Parsing Complete')
    })
    .catch((err) => {
        console.log('PDF Parsing Failed:', err)
    })
