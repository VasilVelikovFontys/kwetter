const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const {handleError, handleLog} = require("../utils/handler");

const createUser = async (userId, username) => {
    try {
        await db.collection('users').doc(userId).set({username, following: [], followers: []});
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const followUser = async (userId, username, followedUsername) => {
    if (username === followedUsername) return handleError("Users cannot follow themselves!");

    //Add followed user's username to the user's following
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        const user = userDocument.data();

        if (!user) return handleError(`User with id ${userId} not found!`);

        if (user.following.includes(followedUsername)) return handleError('Followed user already exists!');
        if (user.following.length === 10) return handleError('Users can follow up to 10 other users!');
        await userDocument.ref.set({...user, following: [...user.following, followedUsername]});

    } catch (error) {
        return handleError(error);
    }

    //Add user's username to the followed user's followers
    try {
        const followedUserSnapshot = await db.collection('users').where('username', '==',  followedUsername).get()
        const followedUserDocument = followedUserSnapshot.docs[0];

        if (!followedUserDocument) handleError('Followed user not found!');
        const followedUser = followedUserDocument.data();

        if (followedUser.followers.includes(username)) return handleError('Follower already exists!');
        await followedUserDocument.ref.set({...followedUser, followers: [...followedUser.followers, username]});

    } catch (error) {
        return handleError(error);
    }

    return {follow: {userId, username, followedUsername}}
}

const getFollowing = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        const user = userDocument.data();

        if (!user) return handleError(`Followed users for user with id ${userId} not found!`);

        return {data: user.following};

    } catch (error) {
        return handleError(error);
    }
}

const getFollowers = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        const user = userDocument.data();

        if (!user) return handleError(`Followers for user with id ${userId} not found!`);

        return {data: user.followers};

    } catch (error) {
        return handleError(error);
    }
}

const deleteUserFromFollowers = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();

        const user = userDocument.data();
        if (!user) return handleLog(`No followers found for user wih id ${userId}!`);

        //Remove user's username from followers' following
        const followerPromises = user.followers.map(followerUsername => {
            return new Promise(async (resolve, reject) => {
                try {
                    const followersSnapshot = await db.collection('users').where('username', '==', followerUsername).get()
                    const followerDocument = followersSnapshot.docs[0];

                    const follower = followerDocument.data();
                    const newFollowing = follower.following.filter(followedUsername => followedUsername !== user.username);

                    await followerDocument.ref.update({following: newFollowing});
                } catch (error) {
                    handleError(error);
                    reject(error);
                }

                resolve(followerUsername);
            });
        });

        const followers = await Promise.all(followerPromises);

        return {followers};

    } catch (error) {
        return handleError(error);
    }
}

const deleteUserFromFollowing = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();

        const user = userDocument.data();
        if (!user) return handleLog(`No followed users found for user wih id ${userId}!`);

        //Remove user's username from following' followers
        const followingPromises = user.following.map(followedUsername => {
            return new Promise(async (resolve, reject) => {
                try {
                    const followedUsersSnapshot = await db.collection('users').where('username', '==', followedUsername).get()
                    const followedUserDocument = followedUsersSnapshot.docs[0];

                    const followedUser = followedUserDocument.data();
                    const newFollowers = followedUser.followers.filter(followerUsername => followerUsername !== user.username);

                    await followedUserDocument.ref.update({followers: newFollowers});
                } catch (error) {
                    handleError(error);
                    reject(error);
                }

                resolve(followedUsername);
            });
        });

        const following = await Promise.all(followingPromises);

        return {following};

    } catch (error) {
        return handleError(error);
    }
}

const deleteUser = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        const user = userDocument.data();

        if (!user) return handleLog(`Data for user with id ${userId} not found!`);

        await userDocument.ref.delete();

    } catch (error) {
        return handleError(error);
    }
    return {}
}

module.exports = {
    createUser,
    followUser,
    getFollowing,
    getFollowers,
    deleteUserFromFollowers,
    deleteUserFromFollowing,
    deleteUser
};
