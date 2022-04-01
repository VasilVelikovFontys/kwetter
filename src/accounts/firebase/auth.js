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

const authenticate = async () => {
    try {
        await auth.signInWithEmailAndPassword(FIRESTORE_SERVICE_EMAIL, FIRESTORE_SERVICE_PASSWORD)
        return console.log(`${NATS_CLIENT_ID} logged in to firebase`);
    } catch (error) {
        return console.log(error);
    }
};

const signOut = () => {
    auth.signOut();
};

module.exports = {
    auth,
    authenticate,
    signOut
};
