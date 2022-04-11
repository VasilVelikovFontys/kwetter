const express = require("express");

const createFollowingRouter = (auth, database, messaging) => {
    const router = express.Router();

    router.post('/following', async (req, res) => {
        const {uid, email, username, firstName, lastName} = req.body;

        if (!uid) return res.status(202).send({error: "User id is required!"});
        if (!email) return res.status(202).send({error: "Email is required!"});
        if (!username) return res.status(202).send({error: "Username is required!"});
        if (!firstName || !lastName) return res.status(202).send({error: "Names are required!"});

        if (auth) await auth.authenticateService();

        try {
            const roles = ['USER'];

            await database.createAccount(uid, email, username, firstName, lastName, roles);

            const account = {uid, username};

            if (messaging) {
                const data = JSON.stringify(account);
                messaging.publishAccountCreated(data);
            }

            res.status(201).send({account});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createFollowingRouter;
