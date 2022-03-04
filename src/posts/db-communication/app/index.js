import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import express from "express";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();

const app = express();

// constants
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/records', (req, res) => {
    db.collection('posts')
        .add({id: 1, text: "Hello world!"})
        .then(() => res.status(200).send("Record added successfully"))
})

app.listen(PORT, HOST);
