const nats = require("node-nats-streaming");
const storage = require("../firebase/storage");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_URL,
    NATS_DURABLE_NAME,
    NATS_QUEUE_GROUP,
    NATS_PICTURE_ADDED_CHANNEL,
    NATS_ACCOUNT_DELETED_CHANNEL
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

    //On Account Deleted
    const accountDeletedSubscription = stan.subscribe(NATS_ACCOUNT_DELETED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountDeletedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {userId} = account;

        if (!userId) return console.log('Cannot destructure account id!');

        const {error} = await storage.deleteUserPicture(userId);
        if (error) return;

        msg.ack();
    });
});

const publishPictureAdded = data => {
    stan.publish(NATS_PICTURE_ADDED_CHANNEL, data);
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    publishPictureAdded,
    closeStan
}
