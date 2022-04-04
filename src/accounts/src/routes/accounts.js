const express = require("express");

const createAccountsRouter = (auth, database, messaging) => {
    const router = express.Router();

    router.post('/accounts', async (req, res) => {
        const {uid, email, username} = req.body;

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

        if (auth) await auth.authenticateService();

        try {
            const account = database.getAccountByUid(uid);

            res.status(200).send({account});
        } catch (error) {
            res.status(202).send({error});
        }
    });

    router.post('/accounts/check-username', async (req, res) => {
        const {username} = req.body;

        try {
            const usernameAvailable = database.checkUsernameAvailable(username);

            if (!usernameAvailable) res.status(200).send({error: "Username already taken!"});

            res.sendStatus(200);
        } catch (error) {
            res.status(202).send({error});
        }
    })

    return router;
}

module.exports = createAccountsRouter;
