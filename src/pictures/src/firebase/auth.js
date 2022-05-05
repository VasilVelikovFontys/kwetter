const firebaseApp = require("./app");
require("firebase/compat/auth");
const auth = firebaseApp.auth();
const {handleError} = require("../utils/errorHandler");

const dotenv = require("dotenv");
dotenv.config();

const {
    FIRESTORE_SERVICE_EMAIL,
    FIRESTORE_SERVICE_PASSWORD,
    NATS_CLIENT_ID
} = process.env;

const authenticateService = async () => {
    try {
        await auth.signInWithEmailAndPassword(FIRESTORE_SERVICE_EMAIL, FIRESTORE_SERVICE_PASSWORD)
        return console.log(`${NATS_CLIENT_ID} logged in to firebase`);
    } catch (error) {
        return handleError(error);
    }
};

const signOutService = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        return handleError(error);
    }
};

module.exports = {
    authenticateService,
    signOutService
};
