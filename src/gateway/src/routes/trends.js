const express = require("express");
const {getData} = require("../utils");

const createTrendsRouter = (trendsUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.get('/trends', async (_req, res) => {
        await getData(res, `${trendsUrl}/trends`);
    });

    return router;
}

module.exports = createTrendsRouter;
