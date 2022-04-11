const express = require("express");
const axios = require("axios");

const createUsersRouter = (accountsUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.get('/users/current-user', async (req, res) => {
        const {uid} = req.user;

        try {
            const accountResponse = await axios.get(`${accountsUrl}/accounts/${uid}`);
            const {account} = accountResponse.data;
            const accountError = accountResponse.data.error;

            if (accountError) return res.status(202).send({error: accountError});

            res.status(201).send({user: account});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createUsersRouter;
