const algoliasearch = require('algoliasearch');
const dotenv = require("dotenv");
dotenv.config();

const {
    ALGOLIA_APP_ID,
    ALGOLIA_ADMIN_API_KEY
} = process.env;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('posts');

const savePost = (postId, data) => {
    try {
        const objectID = postId;
        index.saveObject({...data, objectID});
    } catch (error) {
        console.log(error);
    }
}

const deletePost = async postId => {
    try {
        await index.deleteObject(postId);
    } catch (error) {
        console.log(error);
    }
}

const likePost = async (postId, userId) => {
    try {
        const post = await index.getObject(postId);

        savePost(postId, {...post, likes: [...post.likes, userId]});
    } catch (error) {
        console.log(error);
    }
}

const deletePostLike = async (postId, userId) => {
    try {
        const post = await index.getObject(postId);

        const newLikes = post.likes.filter(postLike => postLike !== userId);
        savePost(postId, {...post, likes: newLikes});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    savePost,
    deletePost,
    likePost,
    deletePostLike
}
