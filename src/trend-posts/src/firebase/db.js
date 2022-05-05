const firebase = require("firebase/compat/app");
const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const {handleError, handleLog} = require("../utils/handler");

const createTimestampFromDate = date => {
    try {
        return {timestamp: new firebase.firestore.Timestamp(date.seconds, date.nanoseconds)};
    } catch (error) {
        return handleError(error);
    }
}

const createPost = async (id, username, text, date) => {
    try {
        const {timestamp, error} = createTimestampFromDate(date);
        if (error) return handleError('Could not create timestamp from date!');

        await db.collection('posts').doc(id).set({username, text, date: timestamp, trends: [], likes: []});
    } catch (error) {
        return handleError(error);
    }
    return {};
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
    return {};
}

const updatePostTrends = async (postId, trends) => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        const post = postDocument.data();

        if (!post) return handleError(`Post with id ${postId} not found!`);

        await db.collection('posts').doc(postId).set({
            ...post,
            trends: [...post.trends, ...trends.map(trend => trend.id)]
        });
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const getPostsByTrend = async trendId => {
    try {
        const snapshot = await db.collection('posts')
            .where('trends','array-contains', trendId).get();

        const posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date.toDate();

            return {...data, date, id: doc.id}
        })

        return {data: posts};
    } catch (error) {
        return handleError(error);
    }
}

const deletePost = async postId => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        if (!postDocument) return handleError(`Post with id ${postId} not found!`);

        await postDocument.ref.delete();
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const deleteLike = async (postId, userId) => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        const post = postDocument.data();

        if (!post) return handleLog(`Post with id ${postId} not found!`);

        const newLikes = post.likes.filter(postLike => postLike !== userId);
        await postDocument.ref.update({likes: newLikes});

    } catch (error) {
        return handleError(error);
    }
    return {};
}

module.exports = {
    createPost,
    likePost,
    updatePostTrends,
    getPostsByTrend,
    deletePost,
    deleteLike
};
