const express = require("express");

const createUsersRouter = database => {
    const router = express.Router();

    router.get('/users/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: 'User id is required!'});

        if (!database) return res.sendStatus(500);

        const {user, error} = await database.getUserById(userId);
        if (error) return res.sendStatus(500);

        return res.status(200).send({user});
    });

    router.get('/users/username/:username', async (req, res) => {
        const {username} = req.params;

        if (!username) return res.status(400).send({error: 'Username is required!'});

        if (!database) return res.sendStatus(500);

        const {user, error} = await database.getUserByUsername(username);
        if (error) return res.sendStatus(500);

        return res.status(200).send({user});
    });

    return router;
}

module.exports = createUsersRouter;
