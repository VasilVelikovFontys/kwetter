const express = require("express");

const createAccountsRouter = (auth, database, messaging) => {
    const router = express.Router();

    router.get('/accounts', async (_req, res) => {
        if (!database) return res.sendStatus(500);

        const {data, error} = await database.getAccounts();
        if (error) return res.status(500).send({error});

        res.status(200).send(data);
    });

    router.post('/accounts', async (req, res) => {
        const {userId, email, username} = req.body;

        if (!userId) return res.status(400).send({error: "User id is required!"});
        if (!email) return res.status(400).send({error: "Email is required!"});
        if (!username) return res.status(400).send({error: "Username is required!"});

        if (!auth || !database || !messaging) return res.sendStatus(500);

        await auth.authenticateService();

        const roles = ['USER'];

        const {error} = await database.createAccount(userId, email, username, roles);
        if (error) return res.status(500).send({error});

        const account = {userId, username, roles};

        const data = JSON.stringify(account);
        messaging.publishAccountCreated(data);

        res.status(201).send({account});
    });

    router.get('/accounts/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: "User id is required!"});

        if (!auth || !database) return res.sendStatus(500);

        await auth.authenticateService();

        const {data, error} = await database.getAccountById(userId);
        if (error) return res.status(500).send({error});

        res.status(200).send({account: {...data, id: userId}});
    });

    router.get('/accounts/:username/check', async (req, res) => {
        const {username} = req.params;

        if (!username) return res.status(400).send({error: "Username is required!"});

        if (!database) return res.sendStatus(500);

        const {available, error} = await database.checkUsernameAvailable(username);
        if (error) return res.status(500).send({error});
        if (!available) return res.status(400).send({error: "Username already taken!"});

        res.sendStatus(200);
    });

    router.patch('/accounts/:userId/promote', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: "Account id is required!"});

        if (!database || !messaging) return res.sendStatus(500);

        const {error} = await database.promoteAccount(userId);
        if (error) return res.status(500).send({error});

        const data = JSON.stringify({userId});
        messaging.publishAccountPromoted(data);

        res.sendStatus(200);
    });

    router.patch('/accounts/:userId/demote', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: "Account id is required!"});

        if (!database || !messaging) return res.sendStatus(500);

        const {error} = await database.demoteAccount(userId);
        if (error) return res.status(500).send({error});

        const data = JSON.stringify({userId});
        messaging.publishAccountDemoted(data);

        res.sendStatus(200);
    });

    router.delete('/accounts/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: "Account id is required!"});

        if (!database || !messaging) return res.sendStatus(500);

        const {account, error} = await database.deleteAccount(userId);
        if (error) return res.status(500).send({error});

        const data = JSON.stringify({userId, username: account.username});
        messaging.publishAccountDeleted(data);

        res.sendStatus(200);
    });

    return router;
}

module.exports = createAccountsRouter;
