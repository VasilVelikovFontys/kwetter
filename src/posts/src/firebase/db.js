const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

module.exports = db;
