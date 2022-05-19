const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const {handleError} = require("../utils/errorHandler");

const getAccounts = async () => {
    try {
        const accountsSnapshot = await db.collection('accounts').orderBy('username').get();
        const accounts = accountsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const accountsNoAdmin = accounts.filter(account => account.roles.indexOf('ADMIN') < 0);

        return {data: accountsNoAdmin};
    } catch (error) {
        return handleError(error);
    }
}

const createAccount = async (userId, email, username, roles) => {
    try {
        await db.collection('accounts').doc(userId).set({email, username, roles});
    } catch (error) {
       return handleError(error);
    }
    return {}
}

const getAccountById = async userId => {
    try {
        const accountDocument = await db.collection('accounts').doc(userId).get();
        return {data: accountDocument.data()};
    } catch (error) {
        return handleError(error);
    }
}

const checkUsernameAvailable = async username => {
    try {
        const accountSnapshot = await db.collection('accounts').where('username', '==', username).get();
        return {available: !accountSnapshot.docs[0]};
    } catch (error) {
        return handleError(error);
    }
}

const promoteAccount = async userId => {
    try {
        await db.collection('accounts').doc(userId)
            .update({
                roles: ['USER', 'MODERATOR']
            });
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const demoteAccount = async userId => {
    try {
        await db.collection('accounts').doc(userId)
            .update({
                roles: ['USER']
            });
    } catch (error) {
        return handleError(error);
    }
    return {};
}

const deleteAccount = async userId => {
    try {
        const accountDocument = await db.collection('accounts').doc(userId).get();
        const account = accountDocument.data();

        if (!account) return handleError(`Account with id ${userId} not found!`);

        await accountDocument.ref.delete();

        return {account: {userId, username: account.username}};

    } catch (error) {
        return handleError(error);
    }
}

module.exports = {
    getAccounts,
    createAccount,
    getAccountById,
    checkUsernameAvailable,
    promoteAccount,
    demoteAccount,
    deleteAccount
};
