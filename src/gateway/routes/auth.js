const express = require("express");
const axios = require("axios");

const router = express.Router();

const {
    ACCOUNTS_SERVICE_HOST,
    ACCOUNTS_SERVICE_PORT
} = process.env;

router.post('/auth/register', async (req, res) => {
    const data = req.body;

    try {
        await axios.post(`${ACCOUNTS_SERVICE_HOST}:${ACCOUNTS_SERVICE_PORT}/accounts`, data);
        res.status(201).send(data);
    } catch (err) {
        res.status(202).send(err);
    }
});

module.exports = router;
