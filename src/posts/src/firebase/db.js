const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const firebase = require("firebase/compat/app");

const createTimestampFromDate = date => {
    return firebase.firestore.Timestamp.fromDate(date);
};

const createPost = async (userId, username, text, date) => {
    const docRef = await db.collection('posts').add({userId, username, text, date});
    return docRef.id;
}

const getPostsByUserId = async uid => {
    const snapshot = await db.collection('posts')
        .where('userId', '==', uid)
        .orderBy('date', 'desc')
        .limit(10).get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.date.toDate();

        return {...data, date, id: doc.id}
    })
};

module.exports = {
    createTimestampFromDate,
    createPost,
    getPostsByUserId
};
