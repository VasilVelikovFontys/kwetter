const express = require("express");

const createUsersRouter = db => {
    const router = express.Router();

    router.get('/users/:uid', async (req, res) => {
        const {uid} = req.params;

        if (!uid) return res.status(202).send({error: 'User id is required!'});

        try {
            const user = await db.getUser(uid);

            return res.status(200).send({user});
        } catch (error) {
            return res.status(204).send({error});
        }
    });

    return router;
}

module.exports = createUsersRouter;
