const express = require("express");
const db = require("../firebase/db")

const router = express.Router();

router.get('/mentioning-posts/:userId', async (req, res) => {
    const {userId} = req.params;

    const querySnapshot = await db.collection('posts').where('mentions','array-contains', userId).get();

    res.status(200).send(querySnapshot.docs.map(doc => doc.data()));
});

module.exports = router;
