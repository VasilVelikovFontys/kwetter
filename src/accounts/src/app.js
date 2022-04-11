const express = require("express");
const bodyParser = require("body-parser");

const createAuthRouter = require('./routes/auth');
const createAccountsRouter = require('./routes/accounts');

const createApp = (auth, database, messaging) => {
    const app = express();
    app.disable('x-powered-by');

    const authRouter = createAuthRouter(auth);
    const accountsRouter = createAccountsRouter(auth, database, messaging);

    app.use(bodyParser.json());

    app.use(authRouter);
    app.use(accountsRouter);

    return app;
}

module.exports = createApp
