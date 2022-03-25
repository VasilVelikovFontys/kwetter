const express = require("express");
const axios = require("axios");

const router = express.Router();

const {
    POSTS_SERVICE_HOST,
    POSTS_SERVICE_PORT
} = process.env;

router.get('/posts', async (req, res) => {
    try {
        const response = await axios.get(`${POSTS_SERVICE_HOST}:${POSTS_SERVICE_PORT}/posts`);
        res.status(200).send(response.data);
    } catch (err) {
        res.status(200).send(err);
    }
});

router.post('/posts', async (req, res) => {
    const data = req.body;
    try {
        await axios.post(`${POSTS_SERVICE_HOST}:${POSTS_SERVICE_PORT}/posts`, data);
        res.status(201).send(data);
    } catch (err) {
        res.status(202).send(err);
    }
});

module.exports = router;
