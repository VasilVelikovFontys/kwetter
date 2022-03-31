const express = require("express");
const axios = require("axios");
const {generateToken} = require("../jwt");

const router = express.Router();

const {
    ACCOUNTS_SERVICE_HOST,
    ACCOUNTS_SERVICE_PORT
} = process.env;

const ACCOUNTS_SERVICE_URL = `${ACCOUNTS_SERVICE_HOST}:${ACCOUNTS_SERVICE_PORT}`

router.post('/auth/register', async (req, res) => {
    const {email, username, password} = req.body;

    try {
        const usernameResponse = await axios.post(`${ACCOUNTS_SERVICE_URL}/accounts/check-username`, {username});
        const usernameError = usernameResponse.data.error;

        if (usernameError) return res.status(202).send({usernameError});

        const registerResponse = await axios.post(`${ACCOUNTS_SERVICE_URL}/auth/register`, {email, password});
        const {uid} = registerResponse.data;
        const registerError = registerResponse.data.error;

        if (registerError) return res.status(202).send({registerError});

        const accountResponse = await axios.post(`${ACCOUNTS_SERVICE_URL}/accounts`, {uid, email, username});
        const {account} = accountResponse.data;
        const accountError = accountResponse.data.error;

        if (accountError) return res.status(202).send({accountError});

        const user = {uid, ...account}
        const jwt = generateToken(user);

        res.status(201).send({jwt});
    } catch (error) {
        res.status(202).send({error});
    }
});

router.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const loginResponse = await axios.post(`${ACCOUNTS_SERVICE_URL}/auth/authenticate`, {email, password});
        const {uid} = loginResponse.data;
        const loginError = loginResponse.data.error;

        if (loginError) return res.status(202).send({loginError});

        const accountResponse = await axios.get(`${ACCOUNTS_SERVICE_URL}/accounts/${uid}`);
        const {account} = accountResponse.data;
        const accountError = accountResponse.data.error;

        if (accountError) return res.status(202).send({accountError});

        const user = {uid, ...account}
        const jwt = generateToken(user);

        res.status(200).send({jwt});
    } catch (error) {
        res.status(202).send({error});
    }
});

module.exports = router;
