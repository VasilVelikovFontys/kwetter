const express = require("express");
const {getData, postData} = require("../utils");

const createUsersRouter = (usersUrl, detailsUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.get('/users/current', async (req, res) => {
        const {userId} = req.user;

        await getData(res, `${usersUrl}/users/${userId}`);
    });

    router.post('/users/details', async (req, res) => {
        const {userId} = req.user;
        const details = {userId: userId, ...req.body};

        await postData(res, `${detailsUrl}/details`, details);
    });

    router.get('/users/:username', async (req, res) => {
        const {username} = req.params;

        await getData(res, `${usersUrl}/users/username/${username}`);
    });

    return router;
}

module.exports = createUsersRouter;
