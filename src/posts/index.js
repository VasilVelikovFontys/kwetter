const express = require("express");
const bodyParser = require("body-parser");
const nats = require("node-nats-streaming");

const cors = require("cors");

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const dotenv = require("dotenv");
dotenv.config();

const {
    PORT,
    CLIENT_HOST,
    CLIENT_PORT,
    FIRESTORE_API_KEY,
    FIRESTORE_AUTH_DOMAIN,
    FIRESTORE_APP_ID,
    FIRESTORE_MESSAGING_SENDER_ID,
    FIRESTORE_PROJECT_ID,
    FIRESTORE_STORAGE_BUCKET,
    NATS_CLIENT_ID,
    NATS_CLUSTER_ID,
    NATS_HOST,
    NATS_PORT,
    NATS_POST_CREATED_CHANNEL
} = process.env;

const firebaseConfig = {
    apiKey: FIRESTORE_API_KEY,
    authDomain: FIRESTORE_AUTH_DOMAIN,
    projectId: FIRESTORE_PROJECT_ID,
    storageBucket: FIRESTORE_STORAGE_BUCKET,
    messagingSenderId: FIRESTORE_MESSAGING_SENDER_ID,
    appId: FIRESTORE_APP_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

const corsOptions = {
    origin: `${CLIENT_HOST}:${CLIENT_PORT}`,
    optionSuccessStatus: 200
}

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

const stan = nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, {
    url: `${NATS_HOST}:${NATS_PORT}`
});

stan.on('connect', () => {
    console.log(`${NATS_CLIENT_ID} connected to NATS`);

    stan.on('close', () => {
        process.exit();
    });
});

app.get('/posts', async (req, res) => {
    const snapshot = await db.collection('posts').get();
    res.send(snapshot.docs.map(doc => doc.data()));
});

app.post('/posts', async (req, res) => {
    const {userId, text} = req.body;

    const docRef = await db.collection('posts').add({userId, text});

    const post = {id: docRef.id, userId, text};

    const data = JSON.stringify(post);
    stan.publish(NATS_POST_CREATED_CHANNEL, data);

    res.status(201).send(post);
});

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
