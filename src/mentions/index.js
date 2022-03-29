const express = require("express");
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
    NATS_POST_CREATED_CHANNEL,
    NATS_USER_MENTIONED_CHANNEL,
    NATS_DURABLE_NAME,
    NATS_QUEUE_GROUP
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
app.use(cors(corsOptions));

const stan = nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, {
    url: `${NATS_HOST}:${NATS_PORT}`
});

stan.on('connect', () => {
    console.log(`${NATS_CLIENT_ID} connected to NATS`);

    stan.on('close', () => {
        process.exit();
    });

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName(NATS_DURABLE_NAME);

    const subscription = stan.subscribe(NATS_POST_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);

    subscription.on('message', async (msg) => {
        const receivedData = msg.getData();
        const post = JSON.parse(receivedData);

        let username = null;
        try {
            const {text} = post;
            username = text.substring(text.indexOf('@'));
            username = username.substring(1, username.indexOf(' '));
        } catch (error) {
            console.log(error);
        }

        if (!username) return;

        await db.collection('mentions').add({postId: post.id, username});

        const mention = {postId: post.id, username};

        const sentData = JSON.stringify(mention);
        stan.publish(NATS_USER_MENTIONED_CHANNEL, sentData);

        msg.ack();
    })
})

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
