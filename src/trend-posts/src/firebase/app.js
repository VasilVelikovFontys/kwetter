const firebase = require("firebase/compat/app");
const dotenv = require("dotenv");
dotenv.config();

const {
    FIRESTORE_API_KEY,
    FIRESTORE_AUTH_DOMAIN,
    FIRESTORE_APP_ID,
    FIRESTORE_MESSAGING_SENDER_ID,
    FIRESTORE_PROJECT_ID,
    FIRESTORE_STORAGE_BUCKET
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

module.exports = firebaseApp;
