const Joi = require('joi');

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const statusSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Status title is required.',
            'string.min': 'Status title must be at least 2 characters long.',
            'string.max': 'Status title cannot exceed 255 characters.',
        }),
    description: Joi.string()
        .allow(null, '')
        .optional()
});

const projectSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Project name is required.',
            'string.min': 'Project name must be at least 2 characters long.',
            'string.max': 'Project name cannot exceed 255 characters.',
        }),
    description: Joi.string()
        .allow(null, '')
        .optional(),
    status_id: Joi.number(),
    start_date: Joi.date().allow(null, '').optional(),
    end_date: Joi.date().allow(null, '').optional(),
    members: Joi.array().optional()
});

const projectStatusSchema = Joi.object({
    status_id: Joi.number()
})

const memberSchema = Joi.object({
    user_id: Joi.string(),
    member_status: Joi.string(),
});

const resourceSchema = Joi.object({
    title: Joi.string(),
    note: Joi.string().allow(null, ''),
});

const activitySchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Activity title is required.',
            'string.min': 'Activity title must be at least 2 characters long.',
            'string.max': 'Activity title cannot exceed 255 characters.',
        }),
    activity: Joi.string()
        .required()
        .messages({
            'string.empty': 'Activity is required.'
        })
});

module.exports = {
    statusValidator: validator(statusSchema),
    projectValidator: validator(projectSchema),
    projectStatusValidator : validator(projectStatusSchema),
    memberValidator: validator(memberSchema),
    resourceValidator: validator(resourceSchema),
    activityValidator: validator(activitySchema),
}