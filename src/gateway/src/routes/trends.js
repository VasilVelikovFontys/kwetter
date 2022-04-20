const express = require("express");
const axios = require("axios");

const createTrendsRouter = (trendsUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.get('/trends', async (_req, res) => {
        try {
            const trendsResponse = await axios.get(`${trendsUrl}/trends`);
            const {trends} = trendsResponse.data;
            const trendsError = trendsResponse.data.error;

            if (trendsError) return res.status(202).send({error: trendsError});

            res.status(201).send({trends});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createTrendsRouter;
