const nats = require("node-nats-streaming");
const db = require("../firebase/db");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLIENT_ID,
    NATS_CLUSTER_ID,
    NATS_URL,
    NATS_DURABLE_NAME,
    NATS_QUEUE_GROUP,
    NATS_POST_CREATED_CHANNEL,
    NATS_POST_LIKED_CHANNEL,
    NATS_ACCOUNT_DELETED_CHANNEL,
    NATS_POST_DELETED_CHANNEL,
    NATS_LIKE_DELETED_CHANNEL
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
        const {postId, userId} = post;

        const {error} = await db.createPost(postId, userId);
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

        const {postIds, error: userLikesDeletionError} = await db.deleteUserLikes(userId);
        if (userLikesDeletionError) return;

        if (postIds) {
            postIds.forEach(postId => {
                const sentData = JSON.stringify({postId, userId});
                publishLikeDeleted(sentData);
            });
        }

        const {error} = await db.deleteUser(userId);
        if (error) return;

        msg.ack();
    });

    //On Post Deleted
    const postDeletedSubscription = stan.subscribe(NATS_POST_DELETED_CHANNEL, NATS_QUEUE_GROUP, options);
    postDeletedSubscription.on('message', async msg => {
        const data = msg.getData();
        const post = JSON.parse(data);

        const {postId} = post;

        if (!postId) return console.log('Cannot destructure post id!');

        const {error: postLikesDeletionError} = await db.deletePostLikes(postId);
        if (postLikesDeletionError) return;

        const {error: postDeletionError} = await db.deletePost(postId);
        if (postDeletionError) return;

        msg.ack();
    });
});

const publishPostLiked = data => {
    stan.publish(NATS_POST_LIKED_CHANNEL, data);
}

const publishLikeDeleted = data => {
    stan.publish(NATS_LIKE_DELETED_CHANNEL, data);
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    stan,
    closeStan,
    publishPostLiked
};

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
