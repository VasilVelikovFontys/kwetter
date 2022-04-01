const firebaseApp = require("./app");
require("firebase/compat/auth");
const auth = firebaseApp.auth();

const dotenv = require("dotenv");
dotenv.config();

const {
    FIRESTORE_SERVICE_EMAIL,
    FIRESTORE_SERVICE_PASSWORD,
    NATS_CLIENT_ID
} = process.env;

const authenticate = () => {
    auth.signInWithEmailAndPassword(FIRESTORE_SERVICE_EMAIL, FIRESTORE_SERVICE_PASSWORD)
        .then(() => {
            console.log(`${NATS_CLIENT_ID} logged in to firebase`)
        })
        .catch(error => {
            console.log(error);
        });
};

const signOut = () => {
    auth.signOut();
};

module.exports = {
    authenticate,
    signOut
};
