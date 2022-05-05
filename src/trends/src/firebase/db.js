const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();
const {handleError} = require("../utils/errorHandler");

const assureTrend = async title => {
    try {
        const existingTrendSnapshot = await db.collection('trends')
            .where('title', '==', title).get();

        const existingTrend = existingTrendSnapshot.docs[0];

        if (existingTrend) return {id: existingTrend.id};
    } catch (error) {
        return handleError(error);
    }

    try {
        const createdTrendRef = await db.collection('trends').add({title});
        return {id: createdTrendRef.id};
    } catch (error) {
        return handleError(error);
    }
}

const getTrends = async () => {
    try {
        const trendsSnapshot = await db.collection('trends').get();

        const trends = trendsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        return {data: trends};
    } catch (error) {
        return {error};
    }
}

module.exports = {
    assureTrend,
    getTrends
};
