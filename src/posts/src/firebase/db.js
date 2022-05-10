const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const firebase = require("firebase/compat/app");
const {handleError, handleLog} = require("../utils/handler");

const createTimestampFromDate = date => {
    try {
        return {timestamp: firebase.firestore.Timestamp.fromDate(date)};
    } catch (error) {
        return handleError(error);
    }
};

const createPost = async (userId, username, text, timestamp) => {
    try {
        const docRef = await db.collection('posts').add({userId, username, text, date: timestamp, likes: []});
        return {postId: docRef.id};
    } catch (error) {
        return handleError(error);
    }
}

const getPostsByUserId = async userId => {
    try {
        const postsSnapshot = await db.collection('posts')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .limit(10).get();

        if (!postsSnapshot) return {data: []};

        const posts = postsSnapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date.toDate();

            return {...data, date, id: doc.id}
        });

        return {data: posts};
    } catch (error) {
        return handleError(error);
    }
};

const getPostIdsByUserId = async userId => {
    try {
        const postsSnapshot = await db.collection('posts').where('userId', '==', userId).get()

        if (!postsSnapshot) return {data: []};

        const postIds = postsSnapshot.docs.map(doc => doc.ref.id);

        return {data: postIds};
    } catch (error) {
        return handleError(error);
    }
}

const likePost = async (postId, userId) => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        const post = postDocument.data();

        if (!post) return handleLog(`Post with id ${postId} not found!`);

        if (post.likes.includes(userId)) return handleError('User already liked this post!');
        await postDocument.ref.set({...post, likes: [...post.likes, userId]});

    } catch (error) {
        return handleError(error);
    }

    return {};
}

const deleteUserPosts = async userId => {
    try {
        const postsSnapshot = await db.collection('posts').where('userId', '==', userId).get();
        if (!postsSnapshot) return handleLog(`User with id ${userId} has not posted any posts!`);

        const postPromises = postsSnapshot.docs.map(postDocument => {
            return new Promise(async (resolve, reject) => {
                try {
                    await postDocument.ref.delete();

                } catch (error) {
                    handleError(error);
                    reject(error);
                }

                resolve();
            });
        });

        await Promise.all(postPromises);
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
    createTimestampFromDate,
    createPost,
    getPostsByUserId,
    getPostIdsByUserId,
    likePost,
    deleteUserPosts,
    deleteLike
};
