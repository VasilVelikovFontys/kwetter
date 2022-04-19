const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const firebase = require("firebase/compat/app");

const createTimestampFromDate = date => {
    return firebase.firestore.Timestamp.fromDate(date);
};

const createPost = async (userId, username, text, date) => {
    const docRef = await db.collection('posts').add({userId, username, text, date, likes: []});
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

const likePost = async (postId, userId) => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();

        if (!postDocument) return {error: 'Post not found!'};
        const post = postDocument.data();

        if (post.likes.includes(userId)) return {error: 'User already liked this post!'};
        await postDocument.ref.set({...post, likes: [...post.likes, userId]});

    } catch (error) {
        return {error};
    }
}

module.exports = {
    createTimestampFromDate,
    createPost,
    getPostsByUserId,
    likePost
};
