const nats = require("node-nats-streaming");
const db = require("../firebase/db");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_HOST,
    NATS_PORT,
    NATS_ACCOUNT_CREATED_CHANNEL,
    NATS_USER_FOLLOWED_CHANNEL,
    NATS_DURABLE_NAME,
    NATS_QUEUE_GROUP
} = process.env;

const stan = nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, {
    url: `${NATS_HOST}:${NATS_PORT}`
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

    //On Account Created
    const accountCreatedSubscription = stan.subscribe(NATS_ACCOUNT_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountCreatedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {uid, username} = account;

        if (!uid) return console.log('Cannot destructure account id!');
        if (!username) return console.log('Cannot destructure account username!');

        await db.createUser(uid, username);

        msg.ack();
    });
});

const publishUserFollowed = data => {
    stan.publish(NATS_USER_FOLLOWED_CHANNEL, data);
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    closeStan,
    publishUserFollowed
}
