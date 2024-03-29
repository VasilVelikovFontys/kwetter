const express = require("express");
const bodyParser = require("body-parser");

const createPostsRouter = require('./routes/posts');

const createApp = (database, messaging, search) => {
    const app = express();
    app.disable('x-powered-by');

    const postsRouter = createPostsRouter(database, messaging, search);

    app.use(bodyParser.json());

    app.use(postsRouter);

    return app;
}

module.exports = createApp
