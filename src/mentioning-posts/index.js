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
    NATS_ACCOUNT_CREATED_CHANNEL,
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

    const accountCreatedSubscription = stan.subscribe(NATS_ACCOUNT_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountCreatedSubscription.on('message', async (msg) => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {id, username} = account

        await db.collection('users').doc(id).set({username});

        msg.ack();
    });

    const postCreatedSubscription = stan.subscribe(NATS_POST_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    postCreatedSubscription.on('message', async (msg) => {
        const data = msg.getData();
        const post = JSON.parse(data);

        const {id, text} = post;

        await db.collection('posts').doc(id).set({text, mentions: []});

        msg.ack();
    });

    const userMentionedSubscription = stan.subscribe(NATS_USER_MENTIONED_CHANNEL, NATS_QUEUE_GROUP, options);
    userMentionedSubscription.on('message', async (msg) => {
        const data = msg.getData();
        const mention = JSON.parse(data);

        const {username, postId} = mention;

        const userSnapshot = await db.collection('users').where('username', '==', username).get();

        if(userSnapshot.docs.length > 0) {
            const userId = userSnapshot.docs[0].id;
            const postDocument = await db.collection('posts').doc(postId).get();

            if(postDocument) {
                const post = postDocument.data();
                await db.collection('posts').doc(postId).set({
                    ...post,
                    mentions: [...post.mentions, userId]
                });
                msg.ack();
            }
        }
    });
});

app.get('/mentioning-posts/:userId', async (req, res) => {
    const {userId} = req.params;

    const querySnapshot = await db.collection('posts').where('mentions','array-contains', userId).get();

    res.status(200).send(querySnapshot.docs.map(doc => doc.data()));
});

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
