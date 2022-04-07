const express = require("express");
const firebase = require("firebase/compat/app");
const db = require("../firebase/db");
const publishPostCreated = require("../messaging/nats");

const router = express.Router();

router.get('/posts/user/:uid', async (req, res) => {
    const {uid} = req.params;

    if (!uid) return res.status(202).send({error: 'User id is required!'});

    try {
        const snapshot = await db.collection('posts')
            .where('userId', '==', uid)
            .orderBy('date', 'desc')
            .limit(10).get();

        const posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date.toDate();

            return {...data, date, id: doc.id}
        });

        res.status(200).send({posts});
    } catch (error) {
        res.status(204).send({error});
    }
});

router.post('/posts', async (req, res) => {
    const {userId, username, text} = req.body;

    if (!userId) return res.status(202).send({error: 'User id is required!'});
    if (!username) return res.status(202).send({error: 'Username is required!'});
    if (!text) return res.status(202).send({error: 'Text is required!'});

    try {
        const date = firebase.firestore.Timestamp.fromDate(new Date());

        const docRef = await db.collection('posts').add({userId, username, text, date});

        const post = {id: docRef.id, userId, username, text, date};

        const data = JSON.stringify(post);
        publishPostCreated(data);

        res.status(201).send(post);
    } catch (error) {
        console.log(error)
        res.status(202).send({error});
    }
});

module.exports = router;
