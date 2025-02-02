class ResumeParser {
    parseText(text) {
        return {
            personalInfo: this.extractPersonalInfo(text),
            experience: this.extractExperience(text),
            education: this.extractEducation(text),
            skills: this.extractSkills(text),
            languages: this.extractLanguages(text),
            projects: this.extractProjects(text)
        };
    }

    extractPersonalInfo(text) {
        const lines = text.split('\n').slice(0, 3).join(' ');

        return {
            name: lines.match(/([A-Z][a-z]+ [A-Z][a-z]+)/)?.[0] || '',
            location: lines.match(/([A-Za-z]+, [A-Za-z]+)/)?.[0] || '',
            phone: lines.match(/(\d{10})/)?.[0] || '',
            email: lines.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)?.[0] || '',
            linkedin: lines.match(/(www\.linkedin\.com\/in\/[^\s]+)/)?.[0] || ''
        };
    }

    extractExperience(text) {
        const experienceSection = this.extractSection(text, 'EXPERIENCE', 'ACADEMIC PROJECTS');
        if (!experienceSection) return [];

        const experiences = [];
        const experienceBlocks = experienceSection.split(/(?=\n[A-Za-z]+ [A-Za-z]+ ?(?:Intern|Consultant|Manager|Developer))/);

        for (const block of experienceBlocks) {
            if (!block.trim()) continue;

            const lines = block.split('\n').filter(line => line.trim());
            if (lines.length < 2) continue;

            const roleAndDate = lines[0].split(/\s{2,}/);
            const companyLine = lines[1].split(';');

            experiences.push({
                role: roleAndDate[0].trim(),
                duration: roleAndDate[roleAndDate.length - 1].trim(),
                company: companyLine[0].trim(),
                location: companyLine[1]?.trim() || '',
                responsibilities: lines.slice(2)
                    .filter(line => line.startsWith('•'))
                    .map(line => line.replace('•', '').trim())
            });
        }

        return experiences;
    }

    extractProjects(text) {
        const projectsSection = this.extractSection(text, 'ACADEMIC PROJECTS', 'SKILLS');
        if (!projectsSection) return [];

        const projects = [];
        const projectBlocks = projectsSection.split(/(?=\nUndergraduate|Graduate)/);

        for (const block of projectBlocks) {
            if (!block.trim()) continue;

            const lines = block.split('\n').filter(line => line.trim());
            if (lines.length < 2) continue;

            projects.push({
                title: lines[0].split(/\s{2,}/)[0].trim(),
                duration: lines[0].split(/\s{2,}/).pop().trim(),
                description: lines.slice(1)
                    .filter(line => line.startsWith('•'))
                    .map(line => line.replace('•', '').trim())
            });
        }

        return projects;
    }

    extractEducation(text) {
        const educationSection = this.extractSection(text, 'EDUCATION', 'LANGUAGES');
        if (!educationSection) return [];

        const education = [];
        const degrees = educationSection.split(/(?=\n[A-Za-z]+ University|Institute)/);

        for (const degree of degrees) {
            if (!degree.trim()) continue;

            const lines = degree.split('\n').filter(line => line.trim());
            if (lines.length < 2) continue;

            const [institution, ...degreeInfo] = lines[0].split(';');

            education.push({
                institution: institution.trim(),
                degree: degreeInfo.join(';').trim(),
                achievements: lines.slice(1)
                    .filter(line => line.startsWith('Awarded'))
                    .map(line => line.trim()),
                courses: lines.find(line => line.includes('Core subjects'))
                    ?.replace('Core subjects:', '')
                    .split(',')
                    .map(course => course.trim()) || []
            });
        }

        return education;
    }

    extractSkills(text) {
        const skillsSection = this.extractSection(text, 'SKILLS', 'EDUCATION');
        if (!skillsSection) return [];

        return skillsSection
            .replace('SKILLS', '')
            .split(',')
            .map(skill => skill.trim())
            .filter(Boolean);
    }

    extractLanguages(text) {
        const languagesSection = text.match(/LANGUAGES\s*:\s*([^\n]+)/);
        if (!languagesSection) return [];

        return languagesSection[1]
            .split(',')
            .map(lang => lang.trim())
            .filter(Boolean);
    }

    extractSection(text, startMarker, endMarker) {
        const startIndex = text.indexOf(startMarker);
        if (startIndex === -1) return '';

        const endIndex = endMarker ? text.indexOf(endMarker, startIndex) : text.length;
        if (endIndex === -1) return text.slice(startIndex);

        return text.slice(startIndex, endIndex).trim();
    }
}

export default new ResumeParser();