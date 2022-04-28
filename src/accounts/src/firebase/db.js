const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createAccount = async (uid, email, username, roles) => {
    await db.collection('accounts').doc(uid).set({email, username, roles});
}

const getAccountByUid = async uid => {
    const accountDocument = await db.collection('accounts').doc(uid).get();
    return accountDocument.data();
}

const checkUsernameAvailable = async username => {
    const accountSnapshot = await db.collection('accounts').where('username', '==', username).get();
    return !accountSnapshot.docs[0];
}

module.exports = {
    createAccount,
    getAccountByUid,
    checkUsernameAvailable
};
