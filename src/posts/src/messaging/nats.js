const nats = require("node-nats-streaming");
const db = require("../firebase/db");
const algolia = require("../algolia/algolia");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
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

    //On Post Liked
    const postLikedSubscription = stan.subscribe(NATS_POST_LIKED_CHANNEL, NATS_QUEUE_GROUP, options);
    postLikedSubscription.on('message', async msg => {
        const data = msg.getData();
        const like = JSON.parse(data);

        const {postId, userId} = like;

        if (!postId) return console.log('Cannot destructure post id!');
        if (!userId) return console.log('Cannot destructure user id!');

        await algolia.likePost(postId, userId);

        const {error} = await db.likePost(postId, userId);
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

        const {data: posts, error: postsError} = await db.getPostsByUserId(userId);
        if (postsError) return;

        posts.forEach(post => {
            algolia.deletePost(post.id);

            const data = JSON.stringify({postId: post.id});
            publishPostDeleted(data);
        });

        const {error: postsDeletionError} = await db.deleteUserPosts(userId);
        if (postsDeletionError) return;

        msg.ack();
    });

    //On Like Deleted
    const likeDeletedSubscription = stan.subscribe(NATS_LIKE_DELETED_CHANNEL, NATS_QUEUE_GROUP, options);
    likeDeletedSubscription.on('message', async msg => {
        const data = msg.getData();
        const like = JSON.parse(data);

        const {postId, userId} = like;

        if (!userId) return console.log('Cannot destructure like user id!');
        if (!postId) return console.log('Cannot destructure like post id!');

        const {error: likeDeletionError} = await db.deleteLike(postId, userId);
        if (likeDeletionError) return;

        await algolia.deletePostLike(postId, userId);

        msg.ack();
    });
});

const publishPostCreated = data => {
    stan.publish(NATS_POST_CREATED_CHANNEL, data);
}

const publishPostDeleted = data => {
    stan.publish(NATS_POST_DELETED_CHANNEL, data);
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    publishPostCreated,
    closeStan
}
