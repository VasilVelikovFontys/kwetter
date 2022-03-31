const express = require("express");
require("./messaging/nats");

const dotenv = require("dotenv");
dotenv.config();

const {
    PORT
} = process.env;

const app = express();

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);
});
