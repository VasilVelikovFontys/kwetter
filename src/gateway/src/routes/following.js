const express = require("express");
const axios = require("axios");

const createFollowingRouter = (followingUrl, jwtUtils) => {
    const router = express.Router();
    router.use(jwtUtils.authenticateToken);

    router.post('/follow/:followedUsername', async (req, res) => {
        const {uid, username} = req.user;
        const {followedUsername} = req.params;

        try {
            const followResponse = await axios.post(`${followingUrl}/follow/${followedUsername}`, {uid, username});
            const {follow} = followResponse.data;
            const followError = followResponse.data.error;

            if (followError) return res.status(202).send({error: followError});

            res.status(201).send({follow});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    router.get('/following', async (req, res) => {
        const {uid} = req.user;

        try {
            const followingResponse = await axios.get(`${followingUrl}/following/${uid}`);
            const {following} = followingResponse.data;
            const followingError = followingResponse.data.error;

            if (followingError) return res.status(202).send({error: followingError});

            res.status(201).send({following});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    router.get('/followers', async (req, res) => {
        const {uid} = req.user;

        try {
            const followersResponse = await axios.get(`${followingUrl}/followers/${uid}`);
            const {followers} = followersResponse.data;
            const followersError = followersResponse.data.error;

            if (followersError) return res.status(202).send({error: followersError});

            res.status(201).send({followers});
        } catch (error) {
            if (error.code === "ECONNREFUSED") return res.sendStatus(503);
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createFollowingRouter;
