const express = require("express");

const createLikesRouter = (database, messaging) => {
    const router = express.Router();

    router.post('/like/:postId', async (req, res) => {
        const {userId} = req.body;
        const {postId} = req.params;

        if (!postId) return res.status(400).send({error: 'Post id is required!'});
        if (!userId) return res.status(400).send({error: 'User id is required!'});

        if (!database || !messaging) return res.sendStatus(500);

        const {post, error: postError} = await database.getPostById(postId);
        if (postError) return res.sendStatus(500);

        if (post.userId === userId) return res.status(400).send({error: 'Users cannot like their own post!'});
        if (post.likes.indexOf(userId) >= 0) return res.status(400).send({error: 'User already liked this post!'});

        const {like, error: likeError} = await database.likePost(postId, userId);
        if (likeError) return res.sendStatus(500);

        const data = JSON.stringify(like);
        messaging.publishPostLiked(data);

        res.status(201).send({like});
    });

    return router;
}

module.exports = createLikesRouter;
