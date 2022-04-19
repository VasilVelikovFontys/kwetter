const nats = require("node-nats-streaming");
const db = require("../firebase/db");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLIENT_ID,
    NATS_CLUSTER_ID,
    NATS_HOST,
    NATS_PORT,
    NATS_POST_CREATED_CHANNEL,
    NATS_ACCOUNT_CREATED_CHANNEL,
    NATS_POST_LIKED_CHANNEL,
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

        const {uid, username} = account

        if (!uid) return console.log('Cannot destructure account id!');
        if (!username) return console.log('Cannot destructure account username!');

        await db.createUser(uid, username);

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

        await db.createPost(id, userId, username, text, date)

        msg.ack();
    });

    //On User Followed
    const userFollowedSubscription = stan.subscribe(NATS_USER_FOLLOWED_CHANNEL, NATS_QUEUE_GROUP, options);
    userFollowedSubscription.on('message', async msg => {
        const data = msg.getData();
        const follow = JSON.parse(data);

        const {uid, followedUsername} = follow;

        if (!uid) return console.log('Cannot destructure user id!');
        if (!followedUsername) return console.log('Cannot destructure followed user username!');

        await db.followUser(uid, followedUsername);

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

        await db.likePost(postId, userId);

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
