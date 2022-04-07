const express = require("express");
const {authenticate, signOut} = require("./firebase/auth");
require("./messaging/nats");

const dotenv = require("dotenv");
dotenv.config();

const mentioningPostsRoutes = require('./routes/mentioningPosts');

const {
    PORT
} = process.env;

const app = express();

app.use(mentioningPostsRoutes);

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);

    authenticate();
});

process.on('SIGINT', () => signOut());
process.on('SIGTERM', () => signOut());
