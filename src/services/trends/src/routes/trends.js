const express = require("express");

const createTrendsRouter = database => {
    const router = express.Router();

    router.get('/trends', async (_req, res) => {
        if (!database) return res.sendStatus(500);

        const {data, error} = await database.getTrends();
        if (error) return res.sendStatus(500);

        res.status(200).send({trends: data});
    });

    return router;
}

module.exports = createTrendsRouter;
