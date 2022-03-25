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
        const response = await axios.post(`${ACCOUNTS_SERVICE_HOST}:${ACCOUNTS_SERVICE_PORT}/accounts`, data);
        console.log(response)
        res.status(201).send(data);
    } catch (err) {
        res.status(202).send(err);
    }
});

module.exports = router;
