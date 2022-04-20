const express = require("express");

const createTrendsRouter = database => {
    const router = express.Router();

    router.get('/trends', async (req, res) => {
        const trends = await database.getTrends();

        res.status(200).send({trends});
    });

    return router;
}

module.exports = createTrendsRouter;
