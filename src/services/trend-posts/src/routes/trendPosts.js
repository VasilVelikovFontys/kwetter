const express = require("express");

const createTrendPostsRouter = database => {
    const router = express.Router();

    router.get('/posts/trend/:trendId', async (req, res) => {
        const {trendId} = req.params;

        if (!trendId) return res.status(400).send({error: 'Trend id is required!'});

        if (!database) return res.sendStatus(500);

        const {data, error} = await database.getPostsByTrend(trendId);
        if (error) return res.sendStatus(500);

        res.status(200).send({posts: data});
    });

    return router;
}

module.exports = createTrendPostsRouter;
