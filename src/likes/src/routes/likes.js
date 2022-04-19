const express = require("express");

const createLikesRouter = (database, messaging) => {
    const router = express.Router();

    router.post('/like/:postId', async (req, res) => {
        const {userId} = req.body;
        const {postId} = req.params;

        if (!postId) return res.status(202).send({error: 'Post id is required!'});
        if (!userId) return res.status(202).send({error: 'User id is required!'});

        try {
            const likeResponse = await database.likePost(postId, userId);
            const {like} = likeResponse;
            const likeError = likeResponse.error;

            if (likeError) return res.status(202).send({error: likeError});

            const data = JSON.stringify(like);
            messaging.publishPostLiked(data);

            res.status(201).send({like});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createLikesRouter;
