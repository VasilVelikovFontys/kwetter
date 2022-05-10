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
};

const createUser = async (userId, username) => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        const user = userDocument.data();

        if (!user) {
            await db.collection('users').doc(userId).set({username});
        } else {
            await db.collection('users').doc(userId).update({username});
        }
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const createPost = async (postId, username, text, date) => {
    try {
        const {timestamp, error} = createTimestampFromDate(date);
        if (error) return handleError('Could not create timestamp from date!');

        await db.collection('posts').doc(postId).set({username, text, date: timestamp, mentions: [], likes: []});
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const likePost = async (postId, userId) => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();

        if (!postDocument) return handleError(`Post with id ${postId} not found!`);
        const post = postDocument.data();

        if (post.likes.includes(userId)) return handleError('User already liked this post!');
        await postDocument.ref.set({...post, likes: [...post.likes, userId]});

    } catch (error) {
        return handleError(error);
    }

    return {}
}


const getUserIdByUsername = async username => {
    try {
        const userSnapshot = await db.collection('users').where('username', '==', username).get();

        if (userSnapshot.docs.length === 0) return handleError(`User with username ${username} not found!`);

        return {userId: userSnapshot.docs[0].id};

    } catch (error) {
        return handleError(error);
    }
}

const getPostById = async postId => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        if (!postDocument) return handleError(`Post with id ${postId} not found!`);

        return {post: postDocument.data()};

    } catch (error) {
        return {error};
    }
}

const updatePostMentions = async (post, postId, userIds) => {
    try {
        await db.collection('posts').doc(postId).set({
            ...post,
            mentions: [...post.mentions, ...userIds]
        });
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const getMentioningPosts = async userId => {
    try {
        const snapshot = await db.collection('posts')
            .where('mentions','array-contains', userId).get();

        const mentioningPosts = snapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date.toDate();

            return {...data, date, id: doc.id}
        });

        return {data: mentioningPosts};
    } catch (error) {
        return handleError(error);
    }
}

const deleteUser = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        const user = userDocument.data();

        if (!user) return handleLog(`User with id ${userId} not found!`);

        const postsSnapshot = await db.collection('posts').where('mentions', 'array-contains', userId).get();
        if (postsSnapshot.docs.length > 0) return handleError(`User with id ${userId} still has mentions!`);

        await userDocument.ref.delete();

    } catch (error) {
        return handleError(error);
    }

    return {};
}

const deletePost = async postId => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        const post = postDocument.data();

        if (!post) return handleError(`Post with id ${postId} not found!`);

        await postDocument.ref.delete();
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const deleteMention = async (postId, username) => {
    try {
        const {userId, error} = await getUserIdByUsername(username);
        if (error) return handleError(error);

        const postDocument = await db.collection('posts').doc(postId).get();
        const post = postDocument.data();

        if (!post) return handleError(`Post with id ${postId} not found!`);

        const newMentions = post.mentions.filter(mentionUserId => mentionUserId !== userId);

        await postDocument.ref.update({mentions: newMentions});

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
    createUser,
    createPost,
    likePost,
    getUserIdByUsername,
    getPostById,
    updatePostMentions,
    getMentioningPosts,
    deleteUser,
    deletePost,
    deleteMention,
    deleteLike
};
