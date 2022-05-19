const nats = require("node-nats-streaming");
const db = require("../firebase/db");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_URL,
    NATS_DURABLE_NAME,
    NATS_QUEUE_GROUP,
    NATS_ACCOUNT_CREATED_CHANNEL,
    NATS_USER_FOLLOWED_CHANNEL,
    NATS_ACCOUNT_DELETED_CHANNEL
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

    //On Account Created
    const accountCreatedSubscription = stan.subscribe(NATS_ACCOUNT_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountCreatedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {userId, username} = account;

        if (!userId) return console.log('Cannot destructure account id!');
        if (!username) return console.log('Cannot destructure account username!');

        const {error} = await db.createUser(userId, username);
        if (error) return;

        msg.ack();
    });

    //On Account Deleted
    const accountDeletedSubscription = stan.subscribe(NATS_ACCOUNT_DELETED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountDeletedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {userId} = account;

        if (!userId) return console.log('Cannot destructure account id!');

        const {error: followersDeletionError} = await db.deleteUserFromFollowers(userId);
        if (followersDeletionError) return;

        const {error: followingDeletionError} = await db.deleteUserFromFollowing(userId);
        if (followingDeletionError) return;

        const {error: userDeletionError} = await db.deleteUser(userId);
        if (userDeletionError) return;

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
