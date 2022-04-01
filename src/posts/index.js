const express = require("express");
const bodyParser = require("body-parser");
const {authenticate, signOut} = require("./firebase/auth");

const dotenv = require("dotenv");
dotenv.config();

const postRoutes = require('./routes/posts');

const {
    PORT
} = process.env;

const app = express();
app.use(bodyParser.json());

app.use(postRoutes);

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);

    authenticate();
});

process.on('SIGINT', () => signOut());
process.on('SIGTERM', () => signOut());
