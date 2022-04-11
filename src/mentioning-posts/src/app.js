const express = require("express");
const bodyParser = require("body-parser");

const createMentioningPostsRouter = require('./routes/mentioningPosts');

const createApp = (database) => {
    const app = express();
    app.disable('x-powered-by');

    const mentioningPostsRouter = createMentioningPostsRouter(database);

    app.use(bodyParser.json());

    app.use(mentioningPostsRouter);

    return app;
}

module.exports = createApp
