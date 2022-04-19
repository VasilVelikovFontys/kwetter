const express = require("express");

const createPostsRouter = (database, messaging) => {
    const router = express.Router();

    router.get('/posts/user/:uid', async (req, res) => {
        const {uid} = req.params;

        if (!uid) return res.status(202).send({error: 'User id is required!'});

        try {
            const posts = await database.getPostsByUserId(uid);

            return res.status(200).send({posts});
        } catch (error) {
            return res.status(204).send({error});
        }
    });

    router.post('/posts', async (req, res) => {
        const {userId, username, text} = req.body;

        if (!userId) return res.status(202).send({error: 'User id is required!'});
        if (!username) return res.status(202).send({error: 'Username is required!'});
        if (!text) return res.status(202).send({error: 'Text is required!'});
        if ((text.match(/@/g) || []).length > 3) return res.status(202).send({error: "Maximum of 3 mentions is allowed!"});

        try {
            const date = await database.createTimestampFromDate(new Date());

            const postId = await database.createPost(userId, username, text, date);

            const post = {id: postId, userId, username, text, date, likes: []};

            const data = JSON.stringify(post);
            messaging.publishPostCreated(data);

            res.status(201).send(post);
        } catch (error) {
            res.status(202).send({error});
        }
    });

    return router;
}

module.exports = createPostsRouter;
