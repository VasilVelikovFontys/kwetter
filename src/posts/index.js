const express = require("express");
const bodyParser = require("body-parser");
const nats = require("node-nats-streaming");

const cors = require("cors");

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const dotenv = require("dotenv");
dotenv.config();

// const firebaseConfig = {
//     apiKey: process.env.API_KEY || "AIzaSyBnHS1iNI3mxaGHeMAh1XH2-lbS_MvqjXg",
//     authDomain: process.env.AUTH_DOMAIN || "kwetter-posts.firebaseapp.com",
//     projectId: process.env.PROJECT_ID || "kwetter-posts",
//     storageBucket: process.env.STORAGE_BUCKET || "kwetter-posts.appspot.com",
//     messagingSenderId: process.env.MESSAGING_SENDER_ID || "578340542785",
//     appId: process.env.APP_ID || "1:578340542785:web:a986dd952994c0eada29c0",
// };
//
// const firebaseApp = firebase.initializeApp(firebaseConfig);
// export const db = firebaseApp.firestore();

const {
    PORT,
    CLIENT_HOST,
    CLIENT_PORT,
    NATS_CLIENT_ID,
    NATS_CLUSTER_ID,
    NATS_HOST,
    NATS_PORT,
    NATS_POST_CREATED_CHANNEL
} = process.env;

const corsOptions = {
    origin: `${CLIENT_HOST}:${CLIENT_PORT}`,
    optionSuccessStatus: 200
}

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

const posts = [];

const stan = nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, {
    url: `${NATS_HOST}:${NATS_PORT}`
});

stan.on('connect', () => {
    stan.on('close', () => {
        process.exit();
    });
});

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = posts.length;
    const userId = 1;
    const { text } = req.body;
    const post = {id, userId, text};

    posts.push(post);

    const data = JSON.stringify(post);
    stan.publish(NATS_POST_CREATED_CHANNEL, data);

    res.status(201).send(posts[id]);
});

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT}`);
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
