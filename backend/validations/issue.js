const Joi = require('joi');

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false, stripUnknown: true });

const issueItemSchema = Joi.object({
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
});

const issueSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Issue name is required.',
            'string.min': 'Issue name must be at least 2 characters long.',
            'string.max': 'Issue name cannot exceed 255 characters.',
        }),
    description: Joi.string()
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
    status_id: Joi.number().optional(),
    priority_id: Joi.number().optional(),
    tracker_id: Joi.number().optional(),
    label_id: Joi.number().allow(null, '').optional(),
    assignee: Joi.number()
        .allow(null, '')
        .optional(),
}); 

const updateIssueSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Issue name is required.',
            'string.min': 'Issue name must be at least 2 characters long.',
            'string.max': 'Issue name cannot exceed 255 characters.',
        }),
    description: Joi.string()
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
    status_id: Joi.number().optional(),
    priority_id: Joi.number().optional(),
    tracker_id: Joi.number().optional(),
    label_id: Joi.number().allow(null, '').optional(),
    assignee: Joi.number()
        .allow(null, '')
        .optional(),
    progress: Joi.number()
        .allow(null, '')
        .optional(),
}); 

const updateIssueAItemSchema = Joi.object({
    item: Joi.number().required(),
});

const dateSchema = Joi.object({
    date: Joi.string()
        .allow(null, '')
        .optional()
        .pattern(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/)
        .messages({
            "string.pattern.base": "Date must be in format YYYY-MM-DD or YYYY-MM-DD HH:mm:ss"
        })
});

const noteSchema = Joi.object({
    notes: Joi.string()
        .max(1000000)
        .required()
        .messages({
            "string.empty": "Notes cannot be empty.",
            "string.max": "Notes exceed the maximum allowed length.",
            "any.required": "Notes are required."
        })
});

const issueActivitySchema = Joi.object({
    title: Joi.string()
        .max(255)
        .required()
        .messages({
            "string.empty": "Notes cannot be empty.",
            "string.max": "Notes exceed the maximum allowed length.",
            "any.required": "Notes are required."
        }),
    activity: Joi.string()
        .max(1000000)
        .required()
        .messages({
            "string.empty": "Notes cannot be empty.",
            "string.max": "Notes exceed the maximum allowed length.",
            "any.required": "Notes are required."
        })
})

module.exports = {
    issueItemValidator: validator(issueItemSchema),
    issueValidator: validator(issueSchema),
    updateIssueValidator: validator(updateIssueSchema),
    updateIssueItemValidator: validator(updateIssueAItemSchema),
    dateValidator: validator(dateSchema),
    noteValidator: validator(noteSchema),
    issueActivityValidator: validator(issueActivitySchema)
}