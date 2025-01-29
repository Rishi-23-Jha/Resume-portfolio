// src/utils/responseValidator.js
const validateResumeData = (data) => {
    // Default structure if data is missing
    const defaultStructure = {
        basicInfo: {
            name: '',
            email: '',
            phone: '',
            location: ''
        },
        skills: [],
        experience: [],
        education: [],
        projects: []
    };

    try {
        // If data is missing, return default structure
        if (!data) return defaultStructure;

        // Ensure basic info exists and has required fields
        const validatedData = {
            basicInfo: {
                name: data.basicInfo?.name || '',
                email: data.basicInfo?.email || '',
                phone: data.basicInfo?.phone || '',
                location: data.basicInfo?.location || ''
            },
            skills: Array.isArray(data.skills) ? data.skills : [],
            experience: Array.isArray(data.experience) ? data.experience.map(exp => ({
                company: exp.company || '',
                position: exp.position || '',
                duration: exp.duration || '',
                description: exp.description || ''
            })) : [],
            education: Array.isArray(data.education) ? data.education.map(edu => ({
                institution: edu.institution || '',
                degree: edu.degree || '',
                year: edu.year || ''
            })) : [],
            projects: Array.isArray(data.projects) ? data.projects.map(proj => ({
                name: proj.name || '',
                description: proj.description || '',
                technologies: Array.isArray(proj.technologies) ? proj.technologies : []
            })) : []
        };

        return validatedData;
    } catch (error) {
        console.error('Data validation error:', error);
        return defaultStructure;
    }
};

module.exports = { validateResumeData };