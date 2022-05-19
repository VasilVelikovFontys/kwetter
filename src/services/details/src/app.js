const express = require("express");
const bodyParser = require("body-parser");

const createDetailsRouter = require('./routes/details');

const createApp = (database, messaging) => {
    const app = express();
    app.disable('x-powered-by');

    const detailsRouter = createDetailsRouter(database, messaging);

    app.use(bodyParser.json());

    app.use(detailsRouter);

    return app;
}

module.exports = createApp
