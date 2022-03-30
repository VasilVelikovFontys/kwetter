const express = require("express");
const firebaseApp = require("../firebase");
const publishPostCreated = require("../nats");
require("firebase/compat/firestore");

const router = express.Router();
const db = firebaseApp.firestore();

router.get('/posts', async (req, res) => {
    try {
        const snapshot = await db.collection('posts').get();
        res.status(200).send(snapshot.docs.map(doc => doc.data()));
    } catch (err) {
        res.send(204).send(err);
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
    } catch (err) {
        res.status(202).send(err);
    }
});

module.exports = router;
