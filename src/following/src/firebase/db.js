const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createUser = async (uid, username) => {
    await db.collection('users').doc(uid).set({username, following: []});
}

const followUser = async (uid, followedUsername) => {
    const userDocument = await db.collection('users').doc(uid).get();

    if (userDocument) return;
    const user = userDocument.data();
    await db.collection('follows').doc(uid).set({...user, following: [...user.following, followedUsername]});
}

module.exports = {
    createUser,
    followUser
};
