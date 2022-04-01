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
    try {
        const response = await axios.get(`${POSTS_SERVICE_URL}/posts`);
        res.status(200).send(response.data);
    } catch (error) {
        res.status(204).send({error});
    }
});

router.post('/posts', async (req, res) => {
    const data = req.body;
    const {uid} = req.user;

    if (!data.text) return res.status(202).send({error: "Post text is required!"});

    const post = {userId: uid, text: data.text}
    try {
        await axios.post(`${POSTS_SERVICE_URL}/posts`, post);
        res.status(201).send(post);
    } catch (error) {
        res.status(202).send({error});
    }
});

router.get('/posts/mentioning', async (req, res) => {
    const {user} = req;

    try {
        const response = await axios.get(`${MENTIONING_POSTS_SERVICE_URL}/mentioning-posts/${user.uid}`);
        res.status(200).send(response.data);
    } catch (error) {
        res.status(204).send({error});
    }
})

module.exports = router;
