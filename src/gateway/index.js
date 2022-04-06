const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

const {
    PORT,
    CLIENT_HOST,
    CLIENT_PORT
} = process.env;

const corsOptions = {
    origin: `${CLIENT_HOST}:${CLIENT_PORT}`,
    optionSuccessStatus: 200
};

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(authRoutes);
app.use(userRoutes);
app.use(postRoutes);

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);
});
