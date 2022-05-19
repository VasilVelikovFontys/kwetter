const express = require("express");
const bodyParser = require("body-parser");

const createTimelinePostsRouter = require('./routes/timelinePosts');

const createApp = database => {
    const app = express();
    app.disable('x-powered-by');

    const timelinePostsRouter = createTimelinePostsRouter(database);

    app.use(bodyParser.json());

    app.use(timelinePostsRouter);

    return app;
}

module.exports = createApp
