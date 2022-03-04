import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();

const app = require("express")();

// constants
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    db.collection('posts')
        .add("Hello world")
        .then(() => res.status(200).send("Record added successfully"))
})

app.listen(PORT, HOST);
