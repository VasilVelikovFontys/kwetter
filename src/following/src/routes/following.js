const express = require("express");

const createFollowingRouter = (database, messaging) => {
    const router = express.Router();

    router.post('/follow/:followedUsername', async (req, res) => {
        const {uid, username} = req.body;
        const {followedUsername} = req.params;

        if (!uid) return res.status(202).send({error: "User id is required!"});
        if (!username) return res.status(202).send({error: "Username is required!"});
        if (!followedUsername) return res.status(202).send({error: "Followed username is required!"});
        if (username === followedUsername) return res.status(202).send({error: "Users cannot follow themselves!"});

        try {
            const followResponse = await database.followUser(uid, username, followedUsername)
            const {follow} = followResponse;
            const followError = followResponse.error;

            if (followError) res.status(202).send({error: followError});

            const data = JSON.stringify(follow);
            messaging.publishUserFollowed(data);

            res.status(201).send({follow});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    router.get('/following/:uid', async (req, res) => {
        const {uid} = req.params;

        if (!uid) return res.status(202).send({error: "User id is required!"});

        try {
            const following = await database.getFollowing(uid);

            res.status(201).send({following});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    router.get('/followers/:uid', async (req, res) => {
        const {uid} = req.params;

        if (!uid) return res.status(202).send({error: "User id is required!"});

        try {
            const followers = await database.getFollowers(uid);

            res.status(201).send({followers});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createFollowingRouter;
