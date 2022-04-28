const express = require("express");
const axios = require("axios");

const createPostsRouter = (postsUrl, mentioningPostsUrl, trendPostsUrl, likesUrl, timelineUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken)

    const sendError = (res, error) => {
        if (error.code === "ECONNREFUSED") return res.sendStatus(503);
        res.status(204).send({error});
    }

    const getPosts = async (res, url) => {
        const response = await axios.get(url);
        const {posts} = response.data;
        const postsError = response.data.error;
        if (postsError) return res.status(202).send({error: postsError});

        res.status(200).send({posts});
    }

    router.get('/posts', async (req, res) => {
        const {uid} = req.user;

        try {
            const response = await axios.get(`${postsUrl}/posts/user/${uid}`);
            const {posts} = response.data;
            const postsError = response.data.error;
            if (postsError) return res.status(202).send({error: postsError});

            res.status(200).send({posts});
        } catch (error) {
            sendError(res, error);
        }
    });

    router.post('/posts', async (req, res) => {
        const {text} = req.body;
        const {uid, username} = req.user;

        const post = {userId: uid, username, text}
        try {
            const response = await axios.post(`${postsUrl}/posts`, post);
            const postError = response.data.error;
            if (postError) return res.status(202).send({error: postError});

            res.status(201).send({post: response.data});
        } catch (error) {
            sendError(res, error);
        }
    });

    router.get('/posts/mentioning', async (req, res) => {
        const {user} = req;

        try {
            await getPosts(res, `${mentioningPostsUrl}/mentioning-posts/${user.uid}`);
        } catch (error) {
            sendError(res, error);
        }
    });

    router.get('/posts/trend/:trendId', async (req, res) => {
        const {trendId} = req.params;

        try {
            await getPosts(res, `${trendPostsUrl}/trend-posts/${trendId}`);
        } catch (error) {
            sendError(res, error);
        }
    });

    router.post('/posts/:postId/like', async (req, res) => {
        const {user} = req;
        const {postId} = req.params;

        try {
            const response = await axios.post(`${likesUrl}/like/${postId}`, {userId: user.uid});
            const {like} = response.data;
            const likeError = response.data.error;
            if (likeError) return res.status(202).send({error: likeError});

            res.status(200).send({like});
        } catch (error) {
            sendError(res, error);
        }
    });

    router.get('/posts/timeline', async (req, res) => {
        const {user} = req;

        try {
            await getPosts(res, `${timelineUrl}/timeline-posts/${user.uid}`);
        } catch (error) {
            sendError(res, error);
        }
    });

    return router;
}

module.exports = createPostsRouter;
