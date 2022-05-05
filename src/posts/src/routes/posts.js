const express = require("express");

const createPostsRouter = (database, messaging, search) => {
    const router = express.Router();

    router.get('/posts/user/:userId', async (req, res) => {
        const {userId} = req.params;

        if (!userId) return res.status(400).send({error: 'User id is required!'});

        if (!database) return res.sendStatus(500);

        const {data, error} = await database.getPostsByUserId(userId);
        if (error) return res.sendStatus(500);

        return res.status(200).send({posts: data});
    });

    router.post('/posts', async (req, res) => {
        const {userId, username, text} = req.body;

        if (!userId) return res.status(400).send({error: 'Post user id is required!'});
        if (!username) return res.status(400).send({error: 'Post username is required!'});
        if (!text) return res.status(400).send({error: 'Post text is required!'});
        if (text.length > 140) return res.status(400).send({error: "A maximum of 140 characters is allowed!"});
        if ((text.match(/@/g) || []).length > 3) return res.status(400).send({error: "A maximum of 3 mentions is allowed!"});

        if (!database || !messaging || !search) return res.sendStatus(500);

        const {timestamp, error: timestampError} = await database.createTimestampFromDate(new Date());
        if (timestampError) return res.sendStatus(500);

        const {postId, error: postError} = await database.createPost(userId, username, text, timestamp);
        if (postError) return res.sendStatus(500);

        const post = {id: postId, userId, username, text, date: timestamp, likes: []};

        search.savePost(postId, {text, username, date: new Date(), likes: []});

        const data = JSON.stringify(post);
        messaging.publishPostCreated(data);

        res.status(201).send(post);
    });

    return router;
}

module.exports = createPostsRouter;
