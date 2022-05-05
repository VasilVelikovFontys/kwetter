const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const {handleError, handleLog} = require("../utils/handler");

const createPost = async (postId, userId) => {
    try {
        await db.collection('posts').doc(postId).set({userId, likes: []});
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const getPostById = async postId => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        if (!postDocument) return handleError(`Post with id ${postId} not found!`);

        return {post: postDocument.data()}
    } catch (error) {
        return handleError(error);
    }
}

const likePost = async (postId, userId) => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();

        if (!postDocument) return handleError(`Post with id ${postId} not found!`);
        const post = postDocument.data();

        if (post.userId === userId) return handleError(`Users can not like their own posts!`);

        await postDocument.ref.update({likes: [...post.likes, userId]});

    } catch (error) {
        return handleError(error);
    }

    try {
        const userDocument = await db.collection('users').doc(userId).get();

        if (userDocument.data()) {
            const user = userDocument.data();

            await db.collection('users').doc(userId).update({likes: [...user.likes, postId]});
        } else {
            await db.collection('users').doc(userId).set({likes: [postId]});
        }

    } catch (error) {
        return handleError(error);
    }

    return {like: {postId, userId}}
}

const deleteUserLikes = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();

        const user = userDocument.data();
        if (!user) return handleLog(`User with id ${userId} not found!`);

        const likePromises = user.likes.map(postId => {
            return new Promise(async (resolve, reject) => {
                try {
                    const postDocument = await db.collection('posts').doc(postId).get();

                    const post = postDocument.data();
                    const newLikes = post.likes.filter(postLike => postLike !== userId);

                    await postDocument.ref.update({likes: newLikes});
                } catch (error) {
                    handleError(error);
                    reject(error);
                }

                resolve(postId);
            });
        });

        const postIds = await Promise.all(likePromises);

        return {postIds};

    } catch (error) {
        return handleError(error);
    }
}

const deleteUser = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();

        const user = userDocument.data();
        if (!user) return handleLog(`User with id ${userId} not found!`);

        await userDocument.ref.delete();

    } catch (error) {
        return handleError(error);
    }
    return {};
}

const deletePostLikes = async postId => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        const post = postDocument.data();

        if (!post) return handleLog(`Post with id ${postId} not found!`);

        const likesPromises = post.likes.map(userId => {
            return new Promise(async (resolve, reject) => {
                try {
                    const userDocument = await db.collection('users').doc(userId).get();

                    const user = userDocument.data();
                    const newLikes = user.likes.filter(userLike => userLike !== userId);

                    await userDocument.ref.update({likes: newLikes});
                } catch (error) {
                    handleError(error);
                    reject(error);
                }

                resolve();
            });
        });

        await Promise.all(likesPromises);

    } catch (error) {
        return handleError(error);
    }
    return {};
}

const deletePost = async postId => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();
        const post = postDocument.data();

        if (!post) return handleLog(`Post with id ${postId} not found!`);

        await postDocument.ref.delete();
    } catch (error) {
        return handleError(error);
    }
    return {};
}

module.exports = {
    createPost,
    getPostById,
    likePost,
    deleteUser,
    deleteUserLikes,
    deletePost,
    deletePostLikes
};
