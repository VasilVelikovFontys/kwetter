const nats = require("node-nats-streaming");
const db = require("../firebase/db");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_HOST,
    NATS_PORT,
    NATS_POST_CREATED_CHANNEL,
    NATS_POST_LIKED_CHANNEL,
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

    //On Post Liked
    const postLikedSubscription = stan.subscribe(NATS_POST_LIKED_CHANNEL, NATS_QUEUE_GROUP, options);
    postLikedSubscription.on('message', async msg => {
        const data = msg.getData();
        const like = JSON.parse(data);

        const {postId, userId} = like;

        if (!postId) return console.log('Cannot destructure post id!');
        if (!userId) return console.log('Cannot destructure user id!');

        await db.likePost(postId, userId);

        msg.ack();
    });
});

const publishPostCreated = data => {
    stan.publish(NATS_POST_CREATED_CHANNEL, data);
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    publishPostCreated,
    closeStan
}
