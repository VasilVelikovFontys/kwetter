const express = require("express");
const axios = require("axios");

const createAuthRouter = (accountsUrl, jwtUtils) => {
    const router = express.Router();

    router.post('/auth/register', async (req, res) => {
        const {email, username, password} = req.body;

        try {
            const usernameResponse = await axios.post(`${accountsUrl}/accounts/check-username`, {username});
            const usernameError = usernameResponse.data.error;

            if (usernameError) return res.status(202).send({error: usernameError});

            const registerResponse = await axios.post(`${accountsUrl}/auth/register`, {email, password});
            const {uid} = registerResponse.data;
            const registerError = registerResponse.data.error;

            if (registerError) return res.status(202).send({error: registerError});

            const accountResponse = await axios.post(`${accountsUrl}/accounts`, {uid, email, username});
            const {account} = accountResponse.data;
            const accountError = accountResponse.data.error;

            if (accountError) return res.status(202).send({error: accountError});

            const user = {uid, ...account}
            const jwt = jwtUtils.generateToken(user);

            res.status(201).send({jwt});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    router.post('/auth/login', async (req, res) => {
        const {email, password} = req.body;

        try {
            const loginResponse = await axios.post(`${accountsUrl}/auth/authenticate`, {email, password});
            const {uid} = loginResponse.data;
            const loginError = loginResponse.data.error;

            if (loginError) return res.status(202).send({error: loginError});

            const accountResponse = await axios.get(`${accountsUrl}/accounts/${uid}`);
            const {account} = accountResponse.data;
            const accountError = accountResponse.data.error;

            if (accountError) return res.status(202).send({error: accountError});

            const user = {uid, ...account}
            const jwt = jwtUtils.generateToken(user);

            if (!jwt) return res.status(202).send({error: 'Cannot create JWT!'});

            res.status(200).send({jwt});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    router.post('/auth/verify-token', async (req, res) => {
        const {jwt} = req.body;

        const {error} = jwtUtils.verifyToken(jwt);

        res.status(200).send({error});
    });

    return router;
}

module.exports = createAuthRouter;
