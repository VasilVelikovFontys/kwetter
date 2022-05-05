const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const {handleError} = require("../utils/errorHandler");

const createMention = async (postId, username) => {
    try {
        const existingMentionSnapshot = await db.collection('mentions')
            .where('postId', '==', postId)
            .where('username', '==', username).get()

        if (existingMentionSnapshot.docs[0]) return handleError(`Mention of username ${username} already exists for post with id ${postId}!`);

        const mentionRef = await db.collection('mentions').add({postId, username});
        return {mentionId: mentionRef.id}

    } catch (error) {
        return handleError(error);
    }
}

const getMentionPromises = snapshot => {
    return snapshot.docs.map(mentionDocument => {
        return new Promise(async (resolve, reject) => {
            const mention = mentionDocument.data();

            try {
                await mentionDocument.ref.delete();
            } catch (error) {
                handleError(error);
                reject(error);
            }

            resolve(mention);
        });
    });
}

const deleteUsernameMentions = async username => {
    try {
        const mentionsSnapshot = await db.collection('mentions').where('username', '==', username).get();
        if (!mentionsSnapshot) return handleError(`No mentions of username ${username} found!`);

        const mentions = await Promise.all(getMentionPromises(mentionsSnapshot));

        return {mentions};

    } catch (error) {
        return handleError(error);
    }
}

const deletePostMentions = async postId => {
    try {
        const mentionsSnapshot = await db.collection('mentions').where('postId', '==', postId).get();
        if (!mentionsSnapshot) return handleError(`No mentions found for post with id ${postId}!`);

        const mentions = await Promise.all(getMentionPromises(mentionsSnapshot));

        return {mentions};

    } catch (error) {
        return handleError(error);
    }
}

module.exports = {
    createMention,
    deleteUsernameMentions,
    deletePostMentions
};
