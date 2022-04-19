const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const createUser = async (uid, username) => {
    await db.collection('users').doc(uid).set({username, following: [], followers: []});
}

const followUser = async (uid, username, followedUsername) => {
    if (username === followedUsername) return {error: "Users cannot follow themselves!"};

    //Add followed user's username to the user's following
    try {
        const userDocument = await db.collection('users').doc(uid).get();

        if (!userDocument) return {error: 'User not found!'};
        const user = userDocument.data();

        if (user.following.includes(followedUsername)) return {error: 'Followed user already exists!'};
        if (user.following.length === 10) return {error: 'Users can follow up to 10 other users!'};
        await userDocument.ref.set({...user, following: [...user.following, followedUsername]});

    } catch (error) {
        return {error};
    }

    //Add user's username to the followed user's followers
    try {
        const followedUserSnapshot = await db.collection('users').where('username', '==',  followedUsername).get()
        const followedUserDocument = followedUserSnapshot.docs[0];

        if (!followedUserDocument) return {error: 'Followed user not found!'};
        const followedUser = followedUserDocument.data();

        if (followedUser.followers.includes(username)) return {error: 'Follower already exists!'};
        await followedUserDocument.ref.set({...followedUser, followers: [...followedUser.followers, username]});

    } catch (error) {
        return {error};
    }

    return {follow: {uid, username, followedUsername}}
}

const getFollowing = async uid => {
    const userDocument = await db.collection('users').doc(uid).get();
    return userDocument.data().following;
}

const getFollowers = async uid => {
    const userDocument = await db.collection('users').doc(uid).get();
    return userDocument.data().followers;
}

module.exports = {
    createUser,
    followUser,
    getFollowing,
    getFollowers
};
