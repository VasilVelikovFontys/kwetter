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

const authenticateService = async () => {
    try {
        await auth.signInWithEmailAndPassword(FIRESTORE_SERVICE_EMAIL, FIRESTORE_SERVICE_PASSWORD)
        return console.log(`${NATS_CLIENT_ID} logged in to firebase`);
    } catch (error) {
        return console.log(error);
    }
};

const signOutService = async () => {
    await auth.signOut();
};

const registerUser = async (email, password) => {
    const response = await auth.createUserWithEmailAndPassword(email, password);
    return response.user.uid;
};

const authenticateUser = async (email, password) => {
    const response = await auth.signInWithEmailAndPassword(email, password);
    return response.user.uid;
};

module.exports = {
    authenticateService,
    signOutService,
    registerUser,
    authenticateUser
};
