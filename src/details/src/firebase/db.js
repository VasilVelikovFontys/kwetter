const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const {handleError} = require("../utils/errorHandler");

const addDetails = async (userId, details) => {
    try {
        await db.collection('users').doc(userId).set({...details});
        return {details};
    } catch (error) {
        return handleError(error)
    }
}

const deleteDetails = async userId => {
    try {
        await db.collection('users').doc(userId).delete();
    } catch (error) {
        return handleError(error)
    }
    return {};
}

module.exports = {
    addDetails,
    deleteDetails
};
