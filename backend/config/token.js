const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d' // 1 hour,
    });
};

module.exports = generateToken;