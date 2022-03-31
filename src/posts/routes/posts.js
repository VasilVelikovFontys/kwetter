const express = require("express");
const db = require("../firebase/db");
const {authMiddleware, signOut} = require("../firebase/auth");
const publishPostCreated = require("../messaging/nats");

const router = express.Router();

router.use(authMiddleware);

router.get('/posts', async (req, res) => {
    try {
        const snapshot = await db.collection('posts').get();
        res.status(200).send(snapshot.docs.map(doc => doc.data()));
    } catch (error) {
        res.status(204).send({error});
    }
});

router.post('/posts', async (req, res) => {
    const {userId, text} = req.body;

    try {
        const docRef = await db.collection('posts').add({userId, text});

        const post = {id: docRef.id, userId, text};

        const data = JSON.stringify(post);
        publishPostCreated(data);

        res.status(201).send(post);
    } catch (error) {
        res.status(202).send({error});
    }
});

process.on('SIGINT', () => signOut());
process.on('SIGTERM', () => signOut());

module.exports = router;
