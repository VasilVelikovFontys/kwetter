const express = require("express");
const bodyParser = require("body-parser");
const {authenticate, signOut} = require("./firebase/auth");

const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');

const {
    PORT
} = process.env;

const app = express();

app.use(bodyParser.json());

app.use(authRoutes);
app.use(accountRoutes);

app.listen(PORT || 4000, async () => {
    console.log(`Listening on port ${PORT || 4000}`);

    await authenticate();
});

process.on('SIGINT', () => signOut());
process.on('SIGTERM', () => signOut());
