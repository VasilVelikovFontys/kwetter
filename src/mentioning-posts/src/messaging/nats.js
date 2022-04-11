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
    NATS_USER_MENTIONED_CHANNEL,
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

        if (!uid) return console.log('Cannot deconstruct account id!');
        if (!username) return console.log('Cannot deconstruct account username!');

        await db.createUser(uid, username);

        msg.ack();
    });

    //On Post Created
    const postCreatedSubscription = stan.subscribe(NATS_POST_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    postCreatedSubscription.on('message', async msg => {
        const data = msg.getData();
        const post = JSON.parse(data);

        const {id, username, text, date} = post;

        if (!id) return console.log('Cannot deconstruct post id!');
        if (!username) return console.log('Cannot deconstruct post username!');
        if (!text) return console.log('Cannot deconstruct post text!');
        if (!date) return console.log('Cannot deconstruct post date!');

        await db.createPost(id, username, text, date)

        msg.ack();
    });

    //On User Mentioned
    const userMentionedSubscription = stan.subscribe(NATS_USER_MENTIONED_CHANNEL, NATS_QUEUE_GROUP, options);
    userMentionedSubscription.on('message', async msg => {
        const data = msg.getData();
        const mention = JSON.parse(data);

        const {usernames, postId} = mention;

        if (!usernames) return console.log('Cannot deconstruct mention usernames!');
        if (!postId) return console.log('Cannot deconstruct mention post id!');

        const userIds = [];
        for (const username of usernames) {
            const userId = await db.getUserIdByUsername(username);

            if (!userId) {
                msg.ack();
                console.log('User with this username does not exist!');
            }

            userIds.push(userId);
        }

        const post = await db.getPostById(postId);
        if (!post) {
            msg.ack();
            return console.log('Post with this id does not exist!');
        }

        await db.updatePostMentions(post, postId, userIds);
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
