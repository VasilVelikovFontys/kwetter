const express = require("express");
const db = require("../firebase/db");
const publishAccountCreated = require('../messaging/nats');
const {authenticate} = require("../firebase/auth");

const router = express.Router();

router.post('/accounts', async (req, res) => {
    const {uid, email, username} = req.body;

    await authenticate();

    try {
        const roles = ['USER'];

        await db.collection('accounts').doc(uid).set({email, username, roles});

        const account = {uid, email, username, roles};

        const data = JSON.stringify(account);
        publishAccountCreated(data);

        res.status(201).send({account});
    } catch (error) {
        res.status(202).send({error});
    }
});

router.get('/accounts/:uid', async (req, res) => {
    const {uid} = req.params;

    await authenticate();

    try {
        const accountDocument = await db.collection('accounts').doc(uid).get();
        const account = accountDocument.data();

        res.status(200).send({account});
    } catch (error) {
        res.status(202).send({error});
    }
});

router.post('/accounts/check-username', async (req, res) => {
    const {username} = req.body;

    try {
        const accountSnapshot = await db.collection('accounts').where('username', '==', username).get();

        if (accountSnapshot.docs[0]) res.status(200).send({error: "Username already taken!"});

        res.sendStatus(200);
    } catch (error) {
        res.status(202).send({error});
    }
})

module.exports = router;
