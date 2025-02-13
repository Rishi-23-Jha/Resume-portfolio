import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import pdfService from '../services/pdfService.js';

const router = express.Router();

// Store parsed data temporarily
const portfolioStore = new Map();

// Configure multer before using it
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const uploadDir = './uploads';
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// Initialize multer with configuration
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            cb(new Error('Only PDF files are allowed'));
            return;
        }
        cb(null, true);
    }
});

// Upload endpoint
router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        console.log('Processing file:', req.file.path);
        const result = await pdfService.extractText(req.file.path);

        // Clean up uploaded file
        await fs.unlink(req.file.path);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }

        // Generate unique ID and store data
        const resumeId = Date.now().toString();
        portfolioStore.set(resumeId, result.structured);

        console.log('Successfully processed resume:', resumeId);

        res.json({
            success: true,
            resumeId,
            data: result.structured
        });

    } catch (error) {
        console.error('Upload error:', error);
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({
            success: false,
            error: 'Failed to process resume'
        });
    }
});

// GET endpoint// In upload.js

// GET endpoint to fetch portfolio data
router.get('/:resumeId', async (req, res) => {
    try {
        const { resumeId } = req.params;
        console.log('Fetching data for ID:', resumeId);

        // Debug log to check stored data
        console.log('Stored Data:', portfolioStore.get(resumeId));

        const portfolioData = portfolioStore.get(resumeId) || {
            personalInfo: {
                name: "Radhika Sharma",
                title: "Product Manager",
                email: "radhika5@bu.edu",
                phone: "7259953005",
                location: "Bengaluru, India",
                linkedin: "www.linkedin.com/in/radhikaasharmaa"
            },
            skills: ["C", "C++", "Python", "R", "Java", "HTML"].map(skill => ({
                name: skill,
                icon: getSkillIcon(skill)
            })),
            projects: [{
                title: "SPAM DETECTION AND REVIEW ANALYSIS",
                description: "Developed a two layered web detection system",
                image: "/api/placeholder/400/300",
                technologies: ["Python", "Machine Learning"]
            }],
            experience: [{
                role: "Product Manager Intern",
                company: "ISMILE TECHNOLOGIES",
                duration: "10/2021 – Present",
                location: "Bengaluru, India",
                responsibilities: [
                    "Creating product discovery notes",
                    "Recommended a CRM as per client requirements",
                    "Conduct product viability research"
                ]
            }]
        };

        console.log('Sending Data:', portfolioData);

        res.json({
            success: true,
            data: portfolioData
        });
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch portfolio data'
        });
    }
});

function getSkillIcon(skill) {
    const icons = {
        'JavaScript': 'bxl-javascript',
        'Python': 'bxl-python',
        'Java': 'bxl-java',
        'HTML': 'bxl-html5',
        'CSS': 'bxl-css3',
        'C++': 'bx-code-alt',
        'C': 'bx-code-alt',
        'R': 'bx-stats'
    };
    return icons[skill] || 'bx-code-alt';
}

export { router };