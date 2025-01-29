// src/routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const resumeParser = require('../services/resumeParser');
const fs = require('fs');

router.post('/upload', upload.single('resume'), async (req, res) => {
    console.log('Request received');
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File uploaded:', req.file);

        try {
            const parsedData = await resumeParser.parseFile(req.file);

            // Clean up: remove the uploaded file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(200).json({
                message: 'Resume parsed successfully',
                data: parsedData
            });
        } catch (parseError) {
            console.error('Parse error:', parseError);

            // Clean up on error
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(422).json({
                error: 'Failed to parse resume',
                details: parseError.message
            });
        }
    } catch (error) {
        console.error('Route error:', error);

        // Clean up on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: error.message });
    }
});

module.exports = router;