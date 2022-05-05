const express = require("express");
const axios = require("axios");
const {handleError} = require("../utils");

const createAuthRouter = (accountsUrl, jwtUtils) => {
    const router = express.Router();

    router.post('/auth/register', async (req, res) => {
        const {email, username, password} = req.body;

        if (!accountsUrl || !jwtUtils) return res.sendStatus(500);

        try {
            await axios.get(`${accountsUrl}/accounts/${username}/check`);

            const registerResponse = await axios.post(`${accountsUrl}/auth/register`, {email, password});
            const {userId} = registerResponse.data;

            const accountResponse = await axios.post(`${accountsUrl}/accounts`, {userId, email, username});
            const {account} = accountResponse.data;

            const user = {userId, ...account}
            const jwt = jwtUtils.generateToken(user);

            res.status(201).send({jwt});
        } catch (error) {
            handleError(res, error);
        }
    });

    router.post('/auth/login', async (req, res) => {
        const {email, password} = req.body;

        try {
            const loginResponse = await axios.post(`${accountsUrl}/auth/authenticate`, {email, password});
            const {userId} = loginResponse.data;

            const accountResponse = await axios.get(`${accountsUrl}/accounts/${userId}`);
            const {account} = accountResponse.data;

            const user = {userId, ...account}
            const jwt = jwtUtils.generateToken(user);

            if (!jwt) return res.sendStatus(500);

            res.status(200).send({jwt});
        } catch (error) {
            handleError(res, error);
        }
    });

    router.post('/auth/token/verify', async (req, res) => {
        const {jwt} = req.body;

        const {error} = jwtUtils.verifyToken(jwt);

        res.status(200).send({error});
    });

    return router;
}

module.exports = createAuthRouter;
