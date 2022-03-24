const express = require("express");
const bodyParser = require("body-parser");
const nats = require("node-nats-streaming");

const cors = require("cors");

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");
require("firebase/compat/auth");

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
    NATS_ACCOUNT_CREATED_CHANNEL,
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
const auth = firebaseApp.auth();

const corsOptions = {
    origin: `${CLIENT_HOST}:${CLIENT_PORT}`,
    optionSuccessStatus: 200
};

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

app.post('/accounts', async (req, res) => {
    const {email, username, password} = req.body;

    const snapshot = await db.collection('accounts').where('username', '==', username).get();
    const usernameExists = snapshot.docs.length;

    if(!usernameExists) {
        try {
            const authResponse = await auth.createUserWithEmailAndPassword(email, password);

            await db.collection('accounts').doc(authResponse.user.uid).set({email, username});

            const account = {id: authResponse.user.uid, email, username};

            const data = JSON.stringify(account);
            stan.publish(NATS_ACCOUNT_CREATED_CHANNEL, data);

            res.status(201).send(account);
        } catch (err) {
            if(err.code === "auth/weak-password") {
                res.status(202).send("Password must be at least 6 characters!");
            } else {
                res.status(202).send(err);
            }
        }
    } else {
        res.status(202).send("Username already taken!");
    }
});

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
