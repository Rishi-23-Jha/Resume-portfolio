import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: 'File upload error',
            details: err.message
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.message
        });
    }

    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};