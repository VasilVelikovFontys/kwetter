const express = require("express");
const bodyParser = require("body-parser");

const createUsersRouter = require('./routes/users');

const createApp = (database, messaging) => {
    const app = express();
    app.disable('x-powered-by');

    const usersRouter = createUsersRouter(database, messaging);

    app.use(bodyParser.json());

    app.use(usersRouter);

    return app;
}

module.exports = createApp
