const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createMention = async (postId, username) => {
    await db.collection('mentions').add({postId, username});
}

module.exports = {
    createMention
};
