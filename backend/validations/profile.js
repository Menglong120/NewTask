const Joi = require('joi');

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const editProfileSchema = Joi.object({
    firstname: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'FirstName is required.',
            'string.min': 'FirstName must be at least 2 characters long.',
            'string.max': 'FirstName cannot exceed 255 characters.',
        }),
    lastname: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'LastName is required.',
            'string.min': 'LastName must be at least 2 characters long.',
            'string.max': 'LastName cannot exceed 255 characters.',
        }),
    disname: Joi.string()
        .allow(null, '')
        .optional(),
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Email must be a valid email address.',
        }),
    description: Joi.string()
        .allow(null, '')
        .optional()
});

const changePasswordSchema = Joi.object({
    old_pass: Joi.string()
        .trim()
        .min(6)
        .max(255)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password cannot exceed 255 characters.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        }),
    new_pass: Joi.string()
        .trim()
        .min(6)
        .max(255)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password cannot exceed 255 characters.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        }),
    renew_pass: Joi.string()
        .valid(Joi.ref('new_pass'))
        .required()
        .messages({
          'string.empty': 'Re-Password is required.',
          'any.only': 'Re-Password must match Password.',
        }),
});

const changeUserPassSchema = Joi.object({
    password: Joi.string()
        .trim()
        .min(6)
        .max(255)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password cannot exceed 255 characters.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        }),
})

module.exports = {
    editProfileValidator: validator(editProfileSchema),
    changePasswordValidator: validator(changePasswordSchema),
    changeUserPassValidator: validator(changeUserPassSchema)
}