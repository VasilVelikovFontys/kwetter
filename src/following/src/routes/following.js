const express = require("express");

const createFollowingRouter = (database, messaging) => {
    const router = express.Router();

    router.post('/follow/:followedUsername', async (req, res) => {
        const {userId, username} = req.body;
        const {followedUsername} = req.params;

        if (!userId) return res.status(400).send({error: "User id is required!"});
        if (!username) return res.status(400).send({error: "Username is required!"});
        if (!followedUsername) return res.status(400).send({error: "Followed username is required!"});
        if (username === followedUsername) return res.status(400).send({error: "Users cannot follow themselves!"});

        if (!database || !messaging) return res.sendStatus(500);

        const {follow, error} = await database.followUser(userId, username, followedUsername)
        if (error) return res.sendStatus(500);

        const data = JSON.stringify(follow);
        messaging.publishUserFollowed(data);

        res.status(201).send({follow});
    });

    router.get('/following/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: "User id is required!"});

        if (!database) return res.sendStatus(500);

        const {data, error} = await database.getFollowing(userId);
        if (error) return res.sendStatus(500);

        res.status(200).send({following: data});
    });

    router.get('/followers/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: "User id is required!"});

        if (!database) return res.sendStatus(500);

        const {data, error} = await database.getFollowers(userId);
        if (error) return res.sendStatus(500);

        res.status(200).send({followers: data});
    });

    return router;
}

module.exports = createFollowingRouter;
