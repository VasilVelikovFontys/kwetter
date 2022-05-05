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
    NATS_ACCOUNT_CREATED_CHANNEL,
    NATS_POST_LIKED_CHANNEL,
    NATS_USER_FOLLOWED_CHANNEL,
    NATS_POST_DELETED_CHANNEL,
    NATS_ACCOUNT_DELETED_CHANNEL,
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

    //On Account Created
    const accountCreatedSubscription = stan.subscribe(NATS_ACCOUNT_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountCreatedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {userId, username} = account

        if (!userId) return console.log('Cannot destructure account id!');
        if (!username) return console.log('Cannot destructure account username!');

        const {error} = await db.createUser(userId, username);
        if (error) return;

        msg.ack();
    });

    //On Post Created
    const postCreatedSubscription = stan.subscribe(NATS_POST_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    postCreatedSubscription.on('message', async msg => {
        const data = msg.getData();
        const post = JSON.parse(data);

        const {id, userId, username, text, date} = post;

        if (!id) return console.log('Cannot destructure post id!');
        if (!userId) return console.log('Cannot destructure user id!');
        if (!username) return console.log('Cannot destructure post username!');
        if (!text) return console.log('Cannot destructure post text!');
        if (!date) return console.log('Cannot destructure post date!');

        const {error} = await db.createPost(id, userId, username, text, date);
        if (error) return;

        msg.ack();
    });

    //On User Followed
    const userFollowedSubscription = stan.subscribe(NATS_USER_FOLLOWED_CHANNEL, NATS_QUEUE_GROUP, options);
    userFollowedSubscription.on('message', async msg => {
        const data = msg.getData();
        const follow = JSON.parse(data);

        const {userId, followedUsername} = follow;

        if (!userId) return console.log('Cannot destructure user id!');
        if (!followedUsername) return console.log('Cannot destructure followed user username!');

        const {error} = await db.followUser(userId, followedUsername);
        if (error) return;

        msg.ack();
    });

    //On Post Liked
    const postLikedSubscription = stan.subscribe(NATS_POST_LIKED_CHANNEL, NATS_QUEUE_GROUP, options);
    postLikedSubscription.on('message', async msg => {
        const data = msg.getData();
        const like = JSON.parse(data);

        const {postId, userId} = like;

        if (!postId) return console.log('Cannot destructure post id!');
        if (!userId) return console.log('Cannot destructure user id!');

        const {error} = await db.likePost(postId, userId);
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

        const {error} = await db.deletePost(postId);
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

        const {error} = await db.deleteUser(userId);
        if (error) return;

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

        msg.ack();
    });
});

const closeStan = () => {
    stan.close();
}

module.exports = {
    stan,
    closeStan
};
