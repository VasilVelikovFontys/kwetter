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
    NATS_POST_MENTIONED_CHANNEL,
    NATS_ACCOUNT_DELETED_CHANNEL,
    NATS_POST_DELETED_CHANNEL,
    NATS_MENTION_DELETED_CHANNEL
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
        const {postId, username, text} = post;

        getUsernamesFromText(text)
            .then(usernames => {
                if (usernames.length === 0) {
                    msg.ack();
                    return console.log('No usernames found!');
                }

                usernames.forEach(async mentionedUsername => {
                    if (username === mentionedUsername) return console.log("Mentioned username matches user's username");
                    await db.createMention(postId, mentionedUsername);
                });

                const mention = {postId, usernames};

                const sentData = JSON.stringify(mention);
                publishPostMentioned(sentData);

                msg.ack();
            });
    });

    //On Account Deleted
    const accountDeletedSubscription = stan.subscribe(NATS_ACCOUNT_DELETED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountDeletedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {username} = account;

        if (!username) return console.log('Cannot destructure account username!');

        const {mentions, error} = await db.deleteUsernameMentions(username);
        if (error) return;

        mentions.forEach(mention => {
           const sentData = JSON.stringify(mention);
           publishMentionDeleted(sentData);
        });

        msg.ack();
    });

    //On Post Deleted
    const postDeletedSubscription = stan.subscribe(NATS_POST_DELETED_CHANNEL, NATS_QUEUE_GROUP, options);
    postDeletedSubscription.on('message', async msg => {
        const data = msg.getData();
        const post = JSON.parse(data);

        const {postId} = post;

        if (!postId) return console.log('Cannot destructure post id!');

        const {mentions, error} = await db.deletePostMentions(postId);
        if (error) return;

        mentions.forEach(mention => {
            const sentData = JSON.stringify(mention);
            publishMentionDeleted(sentData);
        });

        msg.ack();
    });
});

const getUsernamesFromText = async text => {
    return new Promise(resolve => {
        let usernames = [];

        //Clear duplicate '@';
        text = text.replace(/(@)\1+/g, '$1');

        const separators = [' ', '@', '#'];

        while (text.indexOf('@') > -1 && text !== '@') {
            let username = text.substring(text.indexOf('@') + 1);

            separators.forEach(separator => {
                if (username.indexOf(separator) > -1) {
                    username = username.substring(0, username.indexOf(separator));
                }
            });

            if (!usernames.includes(username)) usernames.push(username);
            text = text.replace(`@${username}`, '');
        }

        resolve(usernames);
    });
}

const closeStan = () => {
    stan.close();
}

const publishPostMentioned = data => {
    stan.publish(NATS_POST_MENTIONED_CHANNEL, data);
}

const publishMentionDeleted = data => {
    stan.publish(NATS_MENTION_DELETED_CHANNEL, data);
}

module.exports = {
    stan,
    closeStan
};

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
