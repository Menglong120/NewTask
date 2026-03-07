const Joi = require('joi');

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const registerSchema = Joi.object({
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
    dis_name: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'UserName is required.',
            'string.base': 'firstname.lastname',
        }),
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Email must be a valid email address.',
        }),
    password: Joi.string()
        .trim()
        .min(6)
        .max(255)
        .pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password cannot exceed 255 characters.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        }),
    repassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
          'string.empty': 'Re-Password is required.',
          'any.only': 'Re-Password must match Password.',
        }),
    role_id: Joi.number()
        .allow(null, '')
        .optional(),
    description: Joi.string()
        .allow(null, '')
        .optional(),
    dis_name: Joi.string()
        .allow(null, '')
        .optional(),
    mail_notification: Joi.string()
        .allow(null, '')
        .optional(),
})

const loginSchema = Joi.object({
    // email: Joi.string()
    //     .trim()
    //     .email()
    //     .required()
    //     .messages({
    //         'string.empty': 'Email is required.',
    //         'string.email': 'Email must be a valid email address.',
    //     }),
    dis_name: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'UserName is required.',
            'string.base': 'firstname.lastname',
        }),
    password: Joi.string()
        .trim()
        .min(6)
        .max(255)
        .pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password cannot exceed 255 characters.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        }),
    rememberMe: Joi.number()
})

const userRequestSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Email must be a valid email address.',
        }),
})

const updateRequestSchema = Joi.object({
    status: Joi.number()
        .valid(1, 2, 3)
        .required()
});

module.exports = {
    registerValidator: validator(registerSchema),
    loginValidator: validator(loginSchema),
    userRequestValidator: validator(userRequestSchema),
    updateRequestValidator: validator(updateRequestSchema),
}