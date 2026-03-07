const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const generateToken = (id, maxAge) => {
    return jwt.sign({ id }, 'kot secret', { expiresIn: maxAge });
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken
};