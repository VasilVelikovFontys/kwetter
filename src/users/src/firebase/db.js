const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createUser = async (uid, username) => {
    await db.collection('users').doc(uid).set({username});
}

const addPicture = async (userId, url) => {
    await db.collection('users').doc(userId).update({picture: url});
}

const addDetails = async (userId, details) => {
    await db.collection('users').doc(userId).update({...details});
}

const getUser = async uid => {
    const userDocument = await db.collection('users').doc(uid).get();

    return userDocument.data();
}

module.exports = {
    createUser,
    addPicture,
    addDetails,
    getUser
};
