const express = require("express");
const db = require("../firebase/db")

const router = express.Router();

router.get('/mentioning-posts/:userId', async (req, res) => {
    const {userId} = req.params;

    if (!userId) return res.status(202).send({error: 'User id is required!'});

    const snapshot = await db.collection('posts')
        .where('mentions','array-contains', userId).get();

    const posts = snapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.date.toDate();

        return {...data, date, id: doc.id}
    });

    res.status(200).send({posts});
});

module.exports = router;
