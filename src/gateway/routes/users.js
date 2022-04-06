const express = require("express");
const axios = require("axios");
const {authenticateToken} = require("../jwt");

const router = express.Router();

const {
    ACCOUNTS_SERVICE_HOST,
    ACCOUNTS_SERVICE_PORT
} = process.env;

const ACCOUNTS_SERVICE_URL = `${ACCOUNTS_SERVICE_HOST}:${ACCOUNTS_SERVICE_PORT}`

router.use(authenticateToken);

router.get('/users/current-user', async (req, res) => {
    const {uid} = req.user;

    try {
        const accountResponse = await axios.get(`${ACCOUNTS_SERVICE_URL}/accounts/${uid}`);
        const {account} = accountResponse.data;
        const accountError = accountResponse.data.error;

        if (accountError) return res.status(202).send({error: accountError});

        res.status(201).send({user: account});
    } catch (error) {
        res.status(202).send({error});
    }
});

module.exports = router;
