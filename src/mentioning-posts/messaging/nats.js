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
    accountCreatedSubscription.on('message', async (msg) => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {uid, username} = account

        if (!uid) return console.log('Cannot deconstruct account id!');
        if (!username) return console.log('Cannot deconstruct account username!');

        await db.collection('users').doc(uid).set({username});

        msg.ack();
    });

    //On Post Created
    const postCreatedSubscription = stan.subscribe(NATS_POST_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    postCreatedSubscription.on('message', async (msg) => {
        const data = msg.getData();
        const post = JSON.parse(data);

        const {id, text} = post;

        if (!id) return console.log('Cannot deconstruct post id!');
        if (!text) return console.log('Cannot deconstruct post text!');

        await db.collection('posts').doc(id).set({text, mentions: []});

        msg.ack();
    });

    //On User Mentioned
    const userMentionedSubscription = stan.subscribe(NATS_USER_MENTIONED_CHANNEL, NATS_QUEUE_GROUP, options);
    userMentionedSubscription.on('message', async (msg) => {
        const data = msg.getData();
        const mention = JSON.parse(data);

        const {username, postId} = mention;

        if (!username) return console.log('Cannot deconstruct mention username!');
        if (!postId) return console.log('Cannot deconstruct mention post id!');

        const userSnapshot = await db.collection('users').where('username', '==', username).get();

        if(userSnapshot.docs.length > 0) {
            const userId = userSnapshot.docs[0].id;
            const postDocument = await db.collection('posts').doc(postId).get();

            if(postDocument) {
                const post = postDocument.data();

                if (!post) return console.log('Cannot read post data!');

                await db.collection('posts').doc(postId).set({
                    ...post,
                    mentions: [...post.mentions, userId]
                });
                msg.ack();
            }
        } else {
            msg.ack();
        }
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

module.exports = stan;
