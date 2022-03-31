const express = require("express");
const db = require("../firebase/db")
const {authMiddleware, signOut} = require("../firebase/auth");

const router = express.Router();

router.use(authMiddleware);

router.get('/mentioning-posts/:userId', async (req, res) => {
    const {userId} = req.params;

    const querySnapshot = await db.collection('posts').where('mentions','array-contains', userId).get();

    res.status(200).send(querySnapshot.docs.map(doc => doc.data()));
});

process.on('SIGINT', () => signOut());
process.on('SIGTERM', () => signOut());

module.exports = router;
