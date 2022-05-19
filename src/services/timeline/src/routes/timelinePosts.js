const express = require("express");

const createTimelinePostsRouter = database => {
    const router = express.Router();

    router.get('/posts/user/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: 'User id is required!'});

        if (!database) return res.sendStatus(500);

        const {data, error} = await database.getTimelinePosts(userId);
        if (error) return res.sendStatus(500);

        res.status(200).send({posts: data});
    });

    return router;
}

module.exports = createTimelinePostsRouter;
