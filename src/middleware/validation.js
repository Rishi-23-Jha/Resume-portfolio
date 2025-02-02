import Joi from 'joi';

export const validateUploadRequest = (req, res, next) => {
    const schema = Joi.object({
        file: Joi.any().required(),
        metadata: Joi.object({
            title: Joi.string().max(255),
            description: Joi.string().max(1000)
        }).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
};