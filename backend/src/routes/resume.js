// src/routes/resume.js
import express from 'express';
import parseResume from '../services/resumeParser'

const router = express.Router();

router.get('/portfolio-data', async (req, res) => {
    try {
        // Fetch or generate portfolio data
        const portfolioData = {
            basicInfo: {
                name: 'John Doe',
                title: 'Software Developer',
                email: 'john.doe@example.com',
                linkedin: 'https://linkedin.com/in/johndoe',
                github: 'https://github.com/johndoe',
                summary: 'A passionate software developer with 5+ years of experience...'
            },
            skills: ['React', 'Node.js', 'Python', 'JavaScript'],
            experience: [
                {
                    position: 'Software Engineer',
                    company: 'Tech Corp',
                    duration: 'Jan 2020 - Present',
                    description: 'Developed web applications using React and Node.js...'
                }
            ],
            projects: [
                {
                    title: 'Project 1',
                    description: 'A web application built with React and Node.js.',
                    technologies: ['React', 'Node.js'],
                    link: 'https://project1.com'
                }
            ]
        };

        res.status(200).json(portfolioData);
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
});

export default router;