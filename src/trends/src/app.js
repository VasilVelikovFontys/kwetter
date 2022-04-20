const express = require("express");
const bodyParser = require("body-parser");

const createTrendsRouter = require('./routes/trends');

const createApp = database => {
    const app = express();
    app.disable('x-powered-by');

    const trendsRouter = createTrendsRouter(database);

    app.use(bodyParser.json());

    app.use(trendsRouter);

    return app;
}

module.exports = createApp
