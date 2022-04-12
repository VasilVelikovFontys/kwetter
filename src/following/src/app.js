const express = require("express");
const bodyParser = require("body-parser");

const createFollowingRouter = require('./routes/following');

const createApp = (auth, database) => {
    const app = express();
    app.disable('x-powered-by');

    const followingRouter = createFollowingRouter(auth, database);

    app.use(bodyParser.json());

    app.use(followingRouter);

    return app;
}

module.exports = createApp
