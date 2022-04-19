const express = require("express");
const axios = require("axios");

const createPostsRouter = (postsUrl, mentioningPostsUrl, likesUrl, timelineUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken)

    router.get('/posts', async (req, res) => {
        const {uid} = req.user;

        try {
            const response = await axios.get(`${postsUrl}/posts/user/${uid}`);
            const {posts} = response.data;
            const postsError = response.data.error;
            if (postsError) return res.status(202).send({error: postsError});

            res.status(200).send({posts});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(204).send({error});
        }
    });

    router.post('/posts', async (req, res) => {
        const {text} = req.body;
        const {uid, username} = req.user;

        if (!text) return res.status(202).send({error: "Post text is required!"});
        if ((text.match(/@/g) || []).length > 3) return res.status(202).send({error: "Maximum of 3 mentions is allowed!"});

        const post = {userId: uid, username, text}
        try {
            const response = await axios.post(`${postsUrl}/posts`, post);
            const postError = response.data.error;
            if (postError) return res.status(202).send({error: postError});

            res.status(201).send({post: response.data});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    router.get('/posts/mentioning', async (req, res) => {
        const {user} = req;

        try {
            const response = await axios.get(`${mentioningPostsUrl}/mentioning-posts/${user.uid}`);
            const {posts} = response.data;
            const postsError = response.data.error;
            if (postsError) return res.status(202).send({error: postsError});

            res.status(200).send({mentions: posts});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(204).send({error});
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
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(204).send({error});
        }
    });

    router.get('/posts/timeline', async (req, res) => {
        const {user} = req;

        try {
            const response = await axios.get(`${timelineUrl}/timeline-posts/${user.uid}`);
            const {posts} = response.data;
            const postsError = response.data.error;
            if (postsError) return res.status(202).send({error: postsError});

            res.status(200).send({posts});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(204).send({error});
        }
    });

    return router;
}

module.exports = createPostsRouter;
