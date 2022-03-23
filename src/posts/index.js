const express = require("express");
const bodyParser = require("body-parser");
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

const {PORT, CLIENT_URL, CLIENT_PORT} = process.env;

const corsOptions = {
    origin: `${CLIENT_URL}:${CLIENT_PORT}`,
    optionSuccessStatus: 200
}

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

const posts = [];

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = posts.length;
    const { text } = req.body;
    const post = {id, text};

    posts.push(post);

    res.status(201).send(posts[id]);
});

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT}`);
});
