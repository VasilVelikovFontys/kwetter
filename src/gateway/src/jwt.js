const jwt = require("jsonwebtoken");

const createJwtUtils = secret => {
    const generateToken = data => {
        return jwt.sign({data}, secret, { expiresIn: '1800s' });
    }

    const verifyToken = token => {
        let response = {error: null};

        jwt.verify(token, secret, (error) => {
            response = {error}
        });

        return response;
    };

    const authenticateToken = (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) return res.sendStatus(401);

        jwt.verify(token, secret, (error, verifiedToken) => {
            if (error) return res.sendStatus(403);

            req.user = verifiedToken.data;
            next();
        })
    }

    return {
        generateToken,
        verifyToken,
        authenticateToken
    }
}

module.exports = createJwtUtils;
