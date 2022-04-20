const firebaseApp = require("./app");
require("firebase/compat/firestore");
const db = firebaseApp.firestore();

const assureTrend = async title => {
    try {
        const existingTrendSnapshot = await db.collection('trends')
            .where('title', '==', title).get();

        const existingTrend = existingTrendSnapshot.docs[0];
        if (existingTrend) return {id: existingTrend.id};
    } catch (error) {
        return {error};
    }

    try {
        const createdTrendRef = await db.collection('trends').add({title});
        return {id: createdTrendRef.id};
    } catch (error) {
        return {error};
    }
}

const getTrends = async () => {
    try {
        const trendsSnapshot = await db.collection('trends').get();

        return trendsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        return {error};
    }
}

module.exports = {
    assureTrend,
    getTrends
};
