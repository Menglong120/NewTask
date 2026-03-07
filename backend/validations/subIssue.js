const Joi = require('joi');
const { assign } = require('lodash');

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const subIssueSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 2 characters long.',
            'string.max': 'Name cannot exceed 255 characters.',
        }),
    description: Joi.string()
        .allow(null, '')
        .optional(),
    progress: Joi.number()
        .allow(null, '')
        .optional(),
    start_date: Joi.string()
        .allow(null, '')
        .optional()
        .pattern(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/)
        .messages({
            "string.pattern.base": "Start Date must be in format YYYY-MM-DD or YYYY-MM-DD HH:mm:ss"
        }),
    due_date: Joi.string()
        .allow(null, '')
        .optional()
        .pattern(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/)
        .messages({
            "string.pattern.base": "Due Date must be in format YYYY-MM-DD or YYYY-MM-DD HH:mm:ss"
        }),
    comment: Joi.string()
        .allow(null, '')
        .optional(),
    priority_id: Joi.number()
        .required(),
    status_id: Joi.number()
        .required(),
    label_id: Joi.number()
        .required(),
    tracker_id: Joi.number()
        .required(),
    assignee: Joi.number()
        .allow(null, '')
        .optional(),
});

module.exports = {
    subIssueValidator: validator(subIssueSchema),
}