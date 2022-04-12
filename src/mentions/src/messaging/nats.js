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

    //On Post Created
    const subscription = stan.subscribe(NATS_POST_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);

    subscription.on('message', async (msg) => {
        const receivedData = msg.getData();
        const post = JSON.parse(receivedData);
        const {text} = post;

        getUsernamesFromText(text)
            .then(usernames => {
                if (usernames.length === 0) {
                    msg.ack();
                    return console.log('No username found!');
                }

                usernames.forEach(async (username) => {
                    await db.createMention(post.id, username);
                });

                const mention = {postId: post.id, usernames};

                const sentData = JSON.stringify(mention);
                stan.publish(NATS_USER_MENTIONED_CHANNEL, sentData);
            });

        msg.ack();
    })
});

const getUsernamesFromText = async text => {
    return new Promise(resolve => {
        let usernames = [];

        //Clear duplicate '@';
        text = text.replace(/(@)\1+/g, '$1');

        while (text.indexOf('@') > -1 && text !== '@') {
            let username = text.substring(text.indexOf('@') + 1);

            if(username.indexOf(' ') > -1) {
                username = username.substring(0, username.indexOf(' '));
            }

            if (!usernames.includes(username)) usernames.push(username);
            text = text.replace(`@${username}`, '');
        }

        resolve(usernames);
    });
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    stan,
    closeStan
};

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
