const Joi = require('joi');

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

// Joi schema for validating MIME type and size
const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',  // Images
    'application/pdf', 'application/msword', // DOC/PDF
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/zip', 'application/x-zip-compressed' // ZIP
];

const allowedImageTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/heif'
];

const fileSchema = Joi.object({
    mimetype: Joi.string().valid(...allowedTypes).required(),
    size: Joi.number().max(10 * 1024 * 1024).required() // Max 10MB file size
});

const imageSchema = Joi.object({
    mimetype: Joi.string().valid(...allowedImageTypes).required(),
    size: Joi.number().max(5 * 1024 * 1024).required()
});

module.exports = {
    allowedTypes,
    allowedImageTypes,
    fileValidator: validator(fileSchema),
    imageValidator: validator(imageSchema),
}