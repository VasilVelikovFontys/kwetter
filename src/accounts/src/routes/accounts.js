const express = require("express");

const createAccountsRouter = (auth, database, messaging) => {
    const router = express.Router();

    router.post('/accounts', async (req, res) => {
        const {uid, email, username} = req.body;

        if (!uid) return res.status(202).send({error: "Uid is required!"});
        if (!email) return res.status(202).send({error: "Email is required!"});
        if (!username) return res.status(202).send({error: "Username is required!"});

        if (auth) await auth.authenticateService();

        try {
            const roles = ['USER'];

            await database.createAccount(uid, email, username, roles);

            const account = {uid, email, username, roles};

            if (messaging) {
                const data = JSON.stringify(account);
                messaging.publishAccountCreated(data);
            }

            res.status(201).send({account});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    router.get('/accounts/:uid', async (req, res) => {
        const {uid} = req.params;

        if (!uid) return res.status(202).send({error: "Uid is required!"});

        if (auth) await auth.authenticateService();

        try {
            const account = await database.getAccountByUid(uid);

            res.status(200).send({account});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    router.post('/accounts/check-username', async (req, res) => {
        const {username} = req.body;

        if (!username) return res.status(202).send({error: "Username is required!"});

        try {
            const usernameAvailable = await database.checkUsernameAvailable(username);

            if (!usernameAvailable) return res.status(202).send({error: "Username already taken!"});

            res.sendStatus(200);
        } catch (error) {
            res.status(202).send({error});
        }
    })

    return router;
}

module.exports = createAccountsRouter;
