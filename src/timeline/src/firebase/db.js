const firebase = require("firebase/compat/app");
const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createTimestampFromDate = (date) => {
    return new firebase.firestore.Timestamp(date.seconds, date.nanoseconds);
}

const createUser = async (uid, username) => {
    await db.collection('users').doc(uid).set({username, following: []});
}

const createPost = async (id, userId, username, text, date) => {
    const postTimestamp = createTimestampFromDate(date);
    await db.collection('posts').doc(id).set({userId, username, text, date: postTimestamp, likes: []});
}

const followUser = async (uid, followedUsername) => {
    try {
        const userDocument = await db.collection('users').doc(uid).get();

        if (!userDocument) return {error: 'User not found!'};
        const user = userDocument.data();

        if (user.following.includes(followedUsername)) return {error: 'Followed user already exists!'};
        await userDocument.ref.set({...user, following: [...user.following, followedUsername]});

    } catch (error) {
        return {error};
    }
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

const getTimelinePosts = async userId => {
    const timelinePosts = [];

    const ownPostsSnapshot = await db.collection('posts')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .limit(10).get();

    ownPostsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.date.toDate();

        timelinePosts.push({...data, date, id: doc.id});
    });

    const followedUsernamesSnapshot = await db.collection('users').doc(userId).get();
    const followedUsernames = followedUsernamesSnapshot.data().following;

    if (followedUsernames.length > 0) {
        const followedPostsSnapshot =  await db.collection('posts')
            .where('username', 'in', followedUsernames)
            .orderBy('date', 'desc')
            .limit(10).get();

        followedPostsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const date = data.date.toDate();

            timelinePosts.push({...data, date, id: doc.id});
        });
    }

    timelinePosts.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else if (a.date > b.date) {
            return -1;
        }
        return 0
    });

    return timelinePosts;
}

module.exports = {
    createUser,
    createPost,
    followUser,
    likePost,
    getTimelinePosts
};
