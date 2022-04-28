const express = require("express");
const axios = require("axios");

const createUsersRouter = (usersUrl, detailsUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.get('/users/current-user', async (req, res) => {
        const {uid} = req.user;

        try {
            const userResponse = await axios.get(`${usersUrl}/users/${uid}`);
            const {user} = userResponse.data;
            const userError = userResponse.data.error;

            if (userError) return res.status(202).send({error: userError});

            res.status(201).send({user});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    router.post('/details', async (req, res) => {
        const {uid} = req.user;
        const details = req.body;

        try {
            const detailsResponse = await axios.post(`${detailsUrl}/details/${uid}`, {...details});
            const detailsError = detailsResponse.data.error;

            if (detailsError) return res.status(202).send({error: detailsError});

            res.status(201).send({details});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createUsersRouter;
