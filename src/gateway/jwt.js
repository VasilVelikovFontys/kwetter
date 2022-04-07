const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const {
    JWT_SECRET
} = process.env;

const generateToken = data => {
    return jwt.sign({data}, JWT_SECRET, { expiresIn: '1800s' });
}

const verifyToken = token => {
    let response = {error: null};

    jwt.verify(token, JWT_SECRET, (error) => {
        response = {error}
    });

    return response;
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (error, token) => {
        if (error) return res.sendStatus(403);

        req.user = token.data;
        next();
    })
}

module.exports = {
    generateToken,
    authenticateToken,
    verifyToken
}
