const express = require("express");

const createTrendPostsRouter = database => {
    const router = express.Router();

    router.get('/trend-posts/:trendId', async (req, res) => {
        const {trendId} = req.params;

        if (!trendId) return res.status(202).send({error: 'Trend id is required!'});

        const posts = await database.getPostsByTrend(trendId);

        res.status(200).send({posts});
    });

    return router;
}

module.exports = createTrendPostsRouter;
