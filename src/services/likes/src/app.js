const express = require("express");
const bodyParser = require("body-parser");

const createLikesRouter = require('./routes/likes');

const createApp = (database, messaging) => {
    const app = express();
    app.disable('x-powered-by');

    const likesRouter = createLikesRouter(database, messaging);

    app.use(bodyParser.json());

    app.use(likesRouter);

    return app;
}

module.exports = createApp
