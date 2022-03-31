const firebaseApp = require("./app");
require("firebase/compat/auth");
const auth = firebaseApp.auth();

const dotenv = require("dotenv");
dotenv.config();

const {
    FIRESTORE_SERVICE_EMAIL,
    FIRESTORE_SERVICE_PASSWORD
} = process.env;

const authMiddleware = (req, res, next) => {
    auth.signInWithEmailAndPassword(FIRESTORE_SERVICE_EMAIL, FIRESTORE_SERVICE_PASSWORD)
        .then(() => {
            next();
        })
        .catch(error => {
            return res.status(202).send({error});
        });
};

const signOut = () => {
    auth.signOut();
};

module.exports = {
    authMiddleware,
    signOut
};
