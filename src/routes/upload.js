import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import pdfService from '../services/pdfService.js';
import resumeParser from '../services/resumeParser.js';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const uploadDir = './uploads';
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            console.error('Error creating upload directory:', error);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'));
        }
        cb(null, true);
    }
});

router.post('/parse', upload.single('file'), async (req, res) => {
    try {
        console.log('Request received at /parse endpoint');

        if (!req.file) {
            console.log('No file received');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extract text from PDF
        const pdfData = await pdfService.extractText(req.file.path);
        console.log('PDF text extracted');

        // Parse the resume data
        const parsedData = resumeParser.parseText(pdfData.text);
        console.log('Resume parsed successfully');

        // Clean up the temporary file
        await fs.unlink(req.file.path);

        // Send structured response
        res.json({
            success: true,
            data: {
                parsed: {
                    personalInfo: parsedData.personalInfo,
                    experience: parsedData.experience,
                    education: parsedData.education,
                    skills: parsedData.skills,
                    languages: parsedData.languages,
                    projects: parsedData.projects
                },
                metadata: {
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    pages: pdfData.numPages,
                    documentInfo: pdfData.info
                }
            }
        });

    } catch (error) {
        console.error('Error processing request:', error);
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({
            success: false,
            error: 'Failed to process PDF',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Upload route is working' });
});

export default router;