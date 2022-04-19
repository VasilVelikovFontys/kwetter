const express = require("express");

const createTimelinePostsRouter = database => {
    const router = express.Router();

    router.get('/timeline-posts/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(202).send({error: 'User id is required!'});

        const posts = await database.getTimelinePosts(userId);

        res.status(200).send({posts});
    });

    return router;
}

module.exports = createTimelinePostsRouter;
