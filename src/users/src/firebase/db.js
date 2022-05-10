const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const {handleError, handleLog} = require("../utils/handler");

const createUser = async (userId, username, roles) => {
    try {
        await db.collection('users').doc(userId).set({username, roles});
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const addPicture = async (userId, url) => {
    try {
        await db.collection('users').doc(userId).update({picture: url});

    } catch (error) {
        return handleError(error);
    }
    return {};
}

const addDetails = async (userId, details) => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        const user = userDocument.data();

        if (!user) return handleLog(`User with id ${userId} not found!`);

        await userDocument.ref.update({...details});

    } catch (error) {
        return handleError(error);
    }
    return {};
}

const getUserById = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        const user = userDocument.data();

        if (!user) return handleError(`User with id ${userId} not found!`);

        return {user: {...user, id: userDocument.id}};
    } catch (error) {
        return handleError(error);
    }
}

const getUserByUsername = async username => {
    try {
        const usersSnapshot = await db.collection('users').where('username', '==', username).get();
        if (usersSnapshot.docs.length === 0) return handleError(`User with username ${username} not found!`);

        const userDocument = usersSnapshot.docs[0];
        const user = userDocument.data();

        if (!user) return handleError(`User with username ${username} not found!`);

        return {user: userDocument.data()};
    } catch (error) {
        return handleError(error);
    }
}

const promoteUser = async userId => {
    try {
        await db.collection('users').doc(userId)
            .update({
                roles: ['USER', 'MODERATOR']
            });
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const demoteUser = async userId => {
    try {
        await db.collection('users').doc(userId)
            .update({
                roles: ['USER']
            });
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const deleteUser = async userId => {
    try {
        const userDocument = await db.collection('users').doc(userId).get();
        if (!userDocument) return handleError(`User with id ${userId} not found!`);

        await userDocument.ref.delete();
    } catch (error) {
        return handleError(error);
    }
    return {};
}

module.exports = {
    createUser,
    addPicture,
    addDetails,
    getUserById,
    getUserByUsername,
    promoteUser,
    demoteUser,
    deleteUser
};
