const express = require("express");
const axios = require("axios");
const {authenticateToken} = require("../jwt");

const router = express.Router();

const {
    POSTS_SERVICE_HOST,
    POSTS_SERVICE_PORT,
    MENTIONING_POSTS_SERVICE_HOST,
    MENTIONING_POSTS_SERVICE_PORT
} = process.env;

const POSTS_SERVICE_URL = `${POSTS_SERVICE_HOST}:${POSTS_SERVICE_PORT}`;
const MENTIONING_POSTS_SERVICE_URL = `${MENTIONING_POSTS_SERVICE_HOST}:${MENTIONING_POSTS_SERVICE_PORT}`;

router.use(authenticateToken);

router.get('/posts', async (req, res) => {
    console.log(req.user);

    try {
        const response = await axios.get(`${POSTS_SERVICE_URL}/posts`);
        res.status(200).send(response.data);
    } catch (err) {
        res.status(204).send(err);
    }
});

router.post('/posts', async (req, res) => {
    const data = req.body;
    try {
        await axios.post(`${POSTS_SERVICE_URL}/posts`, data);
        res.status(201).send(data);
    } catch (err) {
        res.status(202).send(err);
    }
});

router.get('/posts/mentioning', async (req, res) => {
    const {user} = req.user;

    try {
        const response = await axios.get(`${MENTIONING_POSTS_SERVICE_URL}/mentioning-posts/${user.uid}`);
        res.status(200).send(response.data);
    } catch (err) {
        res.status(204).send(err);
    }
})

module.exports = router;
