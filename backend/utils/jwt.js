const jwt = require('jsonwebtoken');
const handleResponses = require('./handleResponses');

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'kot secret', (err, decodedToken) => {
            if (err) {
                reject(handleResponses.errorResponse(401, 'Invalid jwt token'), err, []);
            } else {
                resolve(decodedToken);
            }
        });
    });
};

module.exports = { verifyToken };