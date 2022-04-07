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
    const {uid} = req.user;

    try {
        const response = await axios.get(`${POSTS_SERVICE_URL}/posts/user/${uid}`);
        const {posts} = response.data;
        const postsError = response.data.error;
        if (postsError) return res.status(202).send({error: postsError});

        res.status(200).send({posts});
    } catch (error) {
        res.status(204).send({error});
    }
});

router.post('/posts', async (req, res) => {
    const {text} = req.body;
    const {uid, username} = req.user;

    if (!text) return res.status(202).send({error: "Post text is required!"});

    const post = {userId: uid, username, text}
    try {
        const response = await axios.post(`${POSTS_SERVICE_URL}/posts`, post);
        const postError = response.data.error;
        if (postError) return res.status(202).send({error: postError});

        res.status(201).send({post});
    } catch (error) {
        res.status(202).send({error});
    }
});

router.get('/posts/mentioning', async (req, res) => {
    const {user} = req;

    try {
        const response = await axios.get(`${MENTIONING_POSTS_SERVICE_URL}/mentioning-posts/${user.uid}`);
        const {posts} = response.data;
        const postsError = response.data.error;
        if (postsError) return res.status(202).send({error: postsError});

        res.status(200).send({posts});
    } catch (error) {
        res.status(204).send({error});
    }
})

module.exports = router;
