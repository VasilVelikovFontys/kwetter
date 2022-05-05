const express = require("express");
const {getData, postData} = require("../utils");

const createFollowingRouter = (followingUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.post('/follow/:followedUsername', async (req, res) => {
        const {userId, username} = req.user;
        const {followedUsername} = req.params;

        await postData(res, `${followingUrl}/follow/${followedUsername}`, {userId, username})
    });

    router.get('/following', async (req, res) => {
        const {userId} = req.user;

        await getData(res, `${followingUrl}/following/${userId}`);
    });

    router.get('/followers', async (req, res) => {
        const {userId} = req.user;

        await getData(res, `${followingUrl}/followers/${userId}`);
    });

    return router;
}

module.exports = createFollowingRouter;
