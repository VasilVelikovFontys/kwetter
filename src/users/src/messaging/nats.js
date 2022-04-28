const nats = require("node-nats-streaming");
const db = require("../firebase/db");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_HOST,
    NATS_PORT,
    NATS_ACCOUNT_CREATED_CHANNEL,
    NATS_PICTURE_ADDED_CHANNEL,
    NATS_DETAILS_ADDED_CHANNEL,
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

    //On Picture Added
    const pictureAddedSubscription = stan.subscribe(NATS_PICTURE_ADDED_CHANNEL, NATS_QUEUE_GROUP, options);
    pictureAddedSubscription.on('message', async msg => {
        const data = msg.getData();
        const picture = JSON.parse(data);

        const {userId, url} = picture

        if (!userId) return console.log('Cannot destructure account id!');
        if (!url) return console.log('Cannot destructure picture url!');

        await db.addPicture(userId, url);

        msg.ack();
    });

    //On Picture Added
    const detailsAddedSubscription = stan.subscribe(NATS_DETAILS_ADDED_CHANNEL, NATS_QUEUE_GROUP, options);
    detailsAddedSubscription.on('message', async msg => {
        const data = msg.getData();
        const userDetails = JSON.parse(data);

        const {uid, details} = userDetails
        const {firstName, lastName, location, website, bio} = details;

        if (!uid) return console.log('Cannot destructure user id!');
        if (!firstName) return console.log('Cannot destructure first name!');
        if (!lastName) return console.log('Cannot destructure last name!');
        if (!location) return console.log('Cannot destructure location!');
        if (!website) return console.log('Cannot destructure website!');
        if (!bio) return console.log('Cannot destructure bio!');

        await db.addDetails(uid, details);

        msg.ack();
    });
});

const closeStan = () => {
    stan.close();
}

module.exports = {
    closeStan
}
