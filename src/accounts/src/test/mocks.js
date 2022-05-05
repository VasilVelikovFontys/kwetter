const {jest: requiredJest} = require('@jest/globals');

const authenticateService = requiredJest.fn();
const signOutService = requiredJest.fn();
const registerUser = requiredJest.fn();
const authenticateUser = requiredJest.fn();

const createAccount = requiredJest.fn();
const getAccountByuserId = requiredJest.fn();
const checkUsernameAvailable = requiredJest.fn();

const publishAccountCreated = requiredJest.fn();
const closeStan = requiredJest.fn();

const auth = {
    authenticateService,
    signOutService,
    registerUser,
    authenticateUser
};

const database = {
    createAccount,
    getAccountByuserId,
    checkUsernameAvailable
};

const messaging = {
    publishAccountCreated,
    closeStan
};

module.exports = {
    auth,
    database,
    messaging
};
