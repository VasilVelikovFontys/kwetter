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
    NATS_POST_TRENDED_CHANNEL,
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

    //On Post Created
    const postCreatedSubscription = stan.subscribe(NATS_POST_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    postCreatedSubscription.on('message', async msg => {
        const data = msg.getData();
        const post = JSON.parse(data);

        const {id, username, text, date} = post;

        if (!id) return console.log('Cannot destructure post id!');
        if (!username) return console.log('Cannot destructure post username!');
        if (!text) return console.log('Cannot destructure post text!');
        if (!date) return console.log('Cannot destructure post date!');

        try {
            await db.createPost(id, username, text, date)
            msg.ack();
        } catch (error) {
            console.log(error)
        }
    });

    //On Post Trended
    const postTrendedSubscription = stan.subscribe(NATS_POST_TRENDED_CHANNEL, NATS_QUEUE_GROUP, options);
    postTrendedSubscription.on('message', async msg => {
        const data = msg.getData();
        const trendedPost = JSON.parse(data);

        const {postId, trends} = trendedPost;

        if (!postId) return console.log('Cannot destructure post id!');
        if (!trends) return console.log('Cannot destructure post trends!');

        try {
            await db.updatePostTrends(postId, trends);
            msg.ack();
        } catch (error) {
            console.log(error)
        }
    });

    //On Post Liked
    const postLikedSubscription = stan.subscribe(NATS_POST_LIKED_CHANNEL, NATS_QUEUE_GROUP, options);
    postLikedSubscription.on('message', async msg => {
        const data = msg.getData();
        const like = JSON.parse(data);

        const {postId, userId} = like;

        if (!postId) return console.log('Cannot destructure post id!');
        if (!userId) return console.log('Cannot destructure user id!');

        try {
            await db.likePost(postId, userId);
            msg.ack();
        } catch (error) {
            console.log(error)
        }
    });
});

const closeStan = () => {
    stan.close();
}

module.exports = {
    stan,
    closeStan
};
