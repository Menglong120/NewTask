const handleValidation = (validationResult) => {
    if (!validationResult.error) return null;

    const errors = {};
    validationResult.error.details.forEach((element) => {
        errors[element.context.key] = element.message;
    });

    return errors;
};

module.exports = handleValidation;
