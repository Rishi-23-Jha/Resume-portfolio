class TextPreprocessor {
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s@.-]/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();
    }

    extractRelevantSections(text) {
        const sections = text.split(/(?=\b[A-Z][A-Z\s]+\b:?)/);
        return {
            text: this.cleanText(text),
            length: text.length,
            sectionCount: sections.length
        };
    }
}

export default new TextPreprocessor();