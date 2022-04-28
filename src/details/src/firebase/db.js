const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const addDetails = async (uid, details) => {
    try {
        await db.collection('users').doc(uid).set({...details});
        return {details};
    } catch (error) {
        return {error};
    }
}

module.exports = {
    addDetails
};
