const express = require("express");
const bodyParser = require("body-parser");

const createTrendPostsRouter = require('./routes/trendPosts');

const createApp = database => {
    const app = express();
    app.disable('x-powered-by');

    const trendPostsRouter = createTrendPostsRouter(database);

    app.use(bodyParser.json());

    app.use(trendPostsRouter);

    return app;
}

module.exports = createApp
