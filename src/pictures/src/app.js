const express = require("express");
const bodyParser = require("body-parser");

const createPicturesRouter = require('./routes/pictures');

const createApp = (storage, messaging) => {
    const app = express();
    app.disable('x-powered-by');

    const picturesRouter = createPicturesRouter(storage, messaging);

    app.use(bodyParser.json());

    app.use(picturesRouter);

    return app;
}

module.exports = createApp
