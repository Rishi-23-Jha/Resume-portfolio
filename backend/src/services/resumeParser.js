class ResumeParser {
    parseText(text) {
        try {
            return {
                personalInfo: this.extractPersonalInfo(text),
                experience: this.extractExperience(text),
                education: this.extractEducation(text),
                skills: this.extractSkills(text),
                languages: this.extractLanguages(text),
                projects: this.extractProjects(text)
            };
        } catch (error) {
            console.error('Error parsing resume:', error);
            return this.getDefaultStructure();
        }
    }

    getDefaultStructure() {
        return {
            personalInfo: {},
            experience: [],
            education: [],
            skills: [],
            languages: [],
            projects: []
        };
    }

    // Your existing extraction methods...
}

export default new ResumeParser();