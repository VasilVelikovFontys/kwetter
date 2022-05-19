const nats = require("node-nats-streaming");
const db = require("../firebase/db");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLIENT_ID,
    NATS_CLUSTER_ID,
    NATS_URL,
    NATS_POST_CREATED_CHANNEL,
    NATS_POST_TRENDED_CHANNEL,
    NATS_DURABLE_NAME,
    NATS_QUEUE_GROUP
} = process.env;

const stan = nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, {
    url: NATS_URL
});

stan.on('connect', () => {
    console.log(`${NATS_CLIENT_ID} connected to NATS`);

    stan.on('close', () => {
        process.exit();
    });

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName(NATS_DURABLE_NAME);

    //On Post Created
    const subscription = stan.subscribe(NATS_POST_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);

    subscription.on('message', async (msg) => {
        const receivedData = msg.getData();
        const post = JSON.parse(receivedData);
        const {postId, text} = post;

        const postTrends = await getTrendsFromText(text);

        if (postTrends.length === 0) {
            msg.ack();
            return console.log('No trends found!');
        }

        const trends = await assureTrendsExist(postTrends);

        const trendedPost = {postId, trends};

        const sentData = JSON.stringify(trendedPost);
        publishPostTrended(sentData);

        msg.ack();
    })
});

const getTrendsFromText = async text => {
    return new Promise(resolve => {
        const trends = [];

        //Clear duplicate '#';
        text = text.replace(/(#)\1+/g, '$1');

        const separators = [' ', '@', '#'];

        while (text.indexOf('#') > -1 && text !== '#') {
            let trend = text.substring(text.indexOf('#') + 1);

            separators.forEach(separator => {
                if (trend.indexOf(separator) > -1) {
                    trend = trend.substring(0, trend.indexOf(separator));
                }
            });

            if (!trends.includes(trend)) trends.push(trend);
            text = text.replace(`#${trend}`, '');
        }

        resolve(trends);
    });
}

const assureTrendsExist = async postTrends => {
    return new Promise(async resolveTrends => {
        const promises = postTrends.map(async trend => {
            return new Promise(async (resolve, reject) => {
                const {id, error} = await db.assureTrend(trend);

                if (error) reject(error);
                if (id) resolve({id, title: trend});
            });
        })

        const trends = await Promise.all(promises);

        resolveTrends(trends);
    });
}

const closeStan = () => {
    stan.close();
}

const publishPostTrended = data => {
    stan.publish(NATS_POST_TRENDED_CHANNEL, data);
}

module.exports = {
    stan,
    closeStan
};

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
