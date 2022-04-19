const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createPost = async (postId, userId) => {
    await db.collection('posts').doc(postId).set({userId, likes: []});
}

const likePost = async (postId, userId) => {
    try {
        const postDocument = await db.collection('posts').doc(postId).get();

        if (!postDocument) return {error: 'Post not found!'};
        const post = postDocument.data();

        if (post.userId === userId) return {error: 'Users cannot like their own post!'};

        if (post.likes.includes(userId)) return {error: 'User already liked this post!'};
        await postDocument.ref.set({likes: [...post.likes, userId]});

    } catch (error) {
        return {error};
    }

    return {like: {postId, userId}}
}

module.exports = {
    createPost,
    likePost
};
