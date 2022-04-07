const express = require("express");
const bodyParser = require("body-parser");

const makeAuthRouter = require('./routes/auth');
const makeAccountsRouter = require('./routes/accounts');

const createApp = (auth, database, messaging) => {
    const app = express();
    app.disable('x-powered-by');

    const authRouter = makeAuthRouter(auth);
    const accountsRouter = makeAccountsRouter(auth, database, messaging);

    app.use(bodyParser.json());

    app.use(authRouter);
    app.use(accountsRouter);

    return app;
}

module.exports = createApp
