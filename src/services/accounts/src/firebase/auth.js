const firebaseApp = require("./app");
require("firebase/compat/auth");
const {handleError} = require("../utils/errorHandler");

const dotenv = require("dotenv");
dotenv.config();

const {
    FIRESTORE_SERVICE_EMAIL,
    FIRESTORE_SERVICE_PASSWORD,
    NATS_CLIENT_ID
} = process.env;

const auth = firebaseApp.auth();

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

const registerUser = async (email, password) => {
    try {
        const response = await auth.createUserWithEmailAndPassword(email, password);
        return {userId: response.user.uid};
    } catch (error) {
        return handleError(error);
    }
};

const authenticateUser = async (email, password) => {
    try {
        const response = await auth.signInWithEmailAndPassword(email, password);
        return {userId: response.user.uid};
    } catch (error) {
        return handleError(error);
    }
};

module.exports = {
    authenticateService,
    signOutService,
    registerUser,
    authenticateUser
};
