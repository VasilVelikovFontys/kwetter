const express = require("express");
const auth = require("./firebase/auth");
const nats = require("./messaging/nats");

const dotenv = require("dotenv");
dotenv.config();

const {
    PORT
} = process.env;

const handleShutdown = async () => {
    await auth.signOutService();
    nats.closeStan()
}

const app = express();
app.disable('x-powered-by');

app.listen(PORT || 4000, async () => {
    console.log(`Listening on port ${PORT || 4000}`);

    await auth.authenticateService();
});

process.on('SIGINT', () => handleShutdown());
process.on('SIGTERM', () => handleShutdown());
