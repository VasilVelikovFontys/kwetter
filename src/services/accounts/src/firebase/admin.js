const admin = require("firebase-admin");
const {certificate} = require("../admin-certificate.js");

const adminApp = admin.initializeApp({
    credential: admin.credential.cert(certificate)
});

const deleteAccount = async userId => {
    try {
        await adminApp.auth().deleteUser(userId);
    } catch (error) {
        console.log(error);
        return {error};
    }
    return {}
}

module.exports = {
    deleteAccount
}
