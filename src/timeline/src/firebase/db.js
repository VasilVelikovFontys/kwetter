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

const createUser = async (userId, username) => {
    try {
        await db.collection('users').doc(userId).set({username, following: []});
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const createPost = async (postId, userId, username, text, date) => {
    try {
        const {timestamp, error} = createTimestampFromDate(date);
        if (error) return handleError("Could not create timestamp from date!");

        await db.collection('posts').doc(postId).set({userId, username, text, date: timestamp, likes: []});
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const followUser = async (userId, followedUsername) => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();

        if (!userDocument) return handleError(`User with user id ${userId} not found!`);
        const user = userDocument.data();

        if (user.following.includes(followedUsername)) return handleError('Followed user already exists!');
        await userDocument.ref.set({...user, following: [...user.following, followedUsername]});

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
    return {};
}

const getTimelinePosts = async userId => {
    try {
        const timelinePosts = [];

        const snapshotIntoTimeline = snapshot => {
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const date = data.date.toDate();

                timelinePosts.push({...data, date, postId: doc.id});
            });
        }

        const ownPostsSnapshot = await db.collection('posts')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .limit(10).get();

        snapshotIntoTimeline(ownPostsSnapshot);

        const followedUsernamesSnapshot = await db.collection('users').doc(userId).get();
        const followedUsernames = followedUsernamesSnapshot.data().following;

        if (followedUsernames.length > 0) {
            const followedPostsSnapshot =  await db.collection('posts')
                .where('username', 'in', followedUsernames)
                .orderBy('date', 'desc')
                .limit(10).get();

            snapshotIntoTimeline(followedPostsSnapshot);
        }

        timelinePosts.sort((a, b) => {
            if (a.date < b.date) {
                return 1;
            } else if (a.date > b.date) {
                return -1;
            }
            return 0
        });

        return {data: timelinePosts};
    } catch (error) {
        return handleError(error);
    }
}

const deleteUser = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();

        if (!userDocument) return handleError(`User with id ${userId} not found!`);
        const user = userDocument.data();

        const followersSnapshot = await db.collection('users').where('following', 'array-contains', user.username).get()

        //Remove user's username from followers' following
        const followerPromises = followersSnapshot.docs.map(followerDocument => {
            return new Promise(async (resolve, reject) => {
                try {
                    const follower = followerDocument.data();
                    if (!follower) return handleError(`Follower with id ${followerDocument.ref.id} not found!`);

                    const newFollowing = follower.following.filter(followedUsername => followedUsername !== user.username);

                    await followerDocument.ref.update({following: newFollowing});
                } catch (error) {
                    handleError(error);
                    reject(error);
                }

                resolve();
            });
        });

        await Promise.all(followerPromises);

        await userDocument.ref.delete();

    } catch (error) {
        return handleError(error);
    }
    return {}
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
    createUser,
    createPost,
    followUser,
    likePost,
    getTimelinePosts,
    deletePost,
    deleteUser,
    deleteLike
};
