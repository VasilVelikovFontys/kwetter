const express = require("express");
const {getData, postData} = require("../utils");

const createPostsRouter = (postsUrl, mentioningPostsUrl, trendPostsUrl, likesUrl, timelineUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken)

    router.get('/posts', async (req, res) => {
        const {userId} = req.user;

        await getData(res, `${postsUrl}/posts/user/${userId}`);
    });

    router.post('/posts', async (req, res) => {
        const {text} = req.body;
        const {userId, username} = req.user;

        const post = {userId, username, text}
        await postData(res, `${postsUrl}/posts`, post)
    });

    router.get('/posts/mentioning', async (req, res) => {
        const {userId} = req.user;

        await getData(res, `${mentioningPostsUrl}/posts/user/${userId}`);
    });

    router.get('/posts/timeline', async (req, res) => {
        const {userId} = req.user;

        await getData(res, `${timelineUrl}/posts/user/${userId}`);
    });

    router.get('/posts/trend/:trendId', async (req, res) => {
        const {trendId} = req.params;

        await getData(res, `${trendPostsUrl}/posts/trend/${trendId}`);
    });

    router.post('/posts/:postId/like', async (req, res) => {
        const {userId} = req.user;
        const {postId} = req.params;

        await postData(res, `${likesUrl}/like/${postId}`, {userId: userId})
    });

    return router;
}

module.exports = createPostsRouter;
