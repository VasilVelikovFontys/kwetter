const firebase = require("firebase/compat/app");
const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createTimestampFromDate = (date) => {
    return new firebase.firestore.Timestamp(date.seconds, date.nanoseconds);
}

const createPost = async (id, username, text, date) => {
    const postTimestamp = createTimestampFromDate(date);
    await db.collection('posts').doc(id).set({username, text, date: postTimestamp, trends: [], likes: []});
}

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

const updatePostTrends = async (postId, trends) => {
    const postDocument = await db.collection('posts').doc(postId).get();

    if (!postDocument) return {error: "Post does not exist!"};
    const post = postDocument.data();

    await db.collection('posts').doc(postId).set({
        ...post,
        trends: [...post.trends, ...trends.map(trend => trend.id)]
    });
}

const getPostsByTrend = async trendId => {
    const snapshot = await db.collection('posts')
        .where('trends','array-contains', trendId).get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.date.toDate();

        return {...data, date, id: doc.id}
    });
}

module.exports = {
    createPost,
    likePost,
    updatePostTrends,
    getPostsByTrend
};
