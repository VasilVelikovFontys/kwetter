const firebase = require("firebase/compat/app");
const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createTimestampFromDate = (date) => {
    return new firebase.firestore.Timestamp(date.seconds, date.nanoseconds);
}

const createUser = async (uid, username) => {
    await db.collection('users').doc(uid).set({username});
}

const createPost = async (id, username, text, date) => {
    const postTimestamp = createTimestampFromDate(date);
    await db.collection('posts').doc(id).set({username, text, date: postTimestamp, mentions: []});
}

const getUserIdByUsername = async username => {
    const userSnapshot = await db.collection('users').where('username', '==', username).get();

    if (userSnapshot.docs.length === 0) return;

    return userSnapshot.docs[0].id;
}

const getPostById = async id => {
    const postDocument = await db.collection('posts').doc(id).get();

    if (!postDocument) return;
    return postDocument.data();
}

const updatePostMentions = async (post, postId, userIds) => {
    await db.collection('posts').doc(postId).set({
        ...post,
        mentions: [...post.mentions, ...userIds]
    });
}

const getMentioningPosts = async userId => {
    const snapshot = await db.collection('posts')
        .where('mentions','array-contains', userId).get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.date.toDate();

        return {...data, date, id: doc.id}
    });
}

module.exports = {
    createUser,
    createPost,
    getUserIdByUsername,
    getPostById,
    updatePostMentions,
    getMentioningPosts
};
