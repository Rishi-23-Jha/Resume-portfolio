export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>]/g, '')  // Remove potential HTML tags
        .trim();
};