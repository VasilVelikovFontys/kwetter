const nats = require("node-nats-streaming");
const db = require("../firebase/db");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_URL,
    NATS_DURABLE_NAME,
    NATS_QUEUE_GROUP,
    NATS_ACCOUNT_CREATED_CHANNEL,
    NATS_PICTURE_ADDED_CHANNEL,
    NATS_DETAILS_ADDED_CHANNEL,
    NATS_ACCOUNT_PROMOTED_CHANNEL,
    NATS_ACCOUNT_DEMOTED_CHANNEL,
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

    //On Account Created
    const accountCreatedSubscription = stan.subscribe(NATS_ACCOUNT_CREATED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountCreatedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {userId, username, roles} = account

        if (!userId) return console.log('Cannot destructure account id!');
        if (!username) return console.log('Cannot destructure account username!');
        if (!roles) return console.log('Cannot destructure account roles!');

        const {error} = await db.createUser(userId, username, roles);
        if (error) return;

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

        const {error} = await db.addPicture(userId, url);
        if (error) return;

        msg.ack();
    });

    //On Details Added
    const detailsAddedSubscription = stan.subscribe(NATS_DETAILS_ADDED_CHANNEL, NATS_QUEUE_GROUP, options);
    detailsAddedSubscription.on('message', async msg => {
        const data = msg.getData();
        const userDetails = JSON.parse(data);

        const {userId, details} = userDetails
        const {firstName, lastName, location, website, bio} = details;

        if (!userId) return console.log('Cannot destructure user id!');
        if (!firstName) return console.log('Cannot destructure first name!');
        if (!lastName) return console.log('Cannot destructure last name!');
        if (!location) return console.log('Cannot destructure location!');
        if (!website) return console.log('Cannot destructure website!');
        if (!bio) return console.log('Cannot destructure bio!');

        const {error} = await db.addDetails(userId, details);
        if (error) return;

        msg.ack();
    });

    //On Account Promoted
    const accountPromotedSubscription = stan.subscribe(NATS_ACCOUNT_PROMOTED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountPromotedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {userId} = account

        if (!userId) return console.log('Cannot destructure account id!');

        const {error} = await db.promoteUser(userId);
        if (error) return;

        msg.ack();
    });

    //On Account Demoted
    const accountDemotedSubscription = stan.subscribe(NATS_ACCOUNT_DEMOTED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountDemotedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {userId} = account

        if (!userId) return console.log('Cannot destructure account id!');

        const {error} = await db.demoteUser(userId);
        if (error) return;

        msg.ack();
    });

    //On Account Deleted
    const accountDeletedSubscription = stan.subscribe(NATS_ACCOUNT_DELETED_CHANNEL, NATS_QUEUE_GROUP, options);
    accountDeletedSubscription.on('message', async msg => {
        const data = msg.getData();
        const account = JSON.parse(data);

        const {userId} = account

        if (!userId) return console.log('Cannot destructure account id!');

        const {error} = await db.deleteUser(userId);
        if (error) return;

        msg.ack();
    });
});

const closeStan = () => {
    stan.close();
}

module.exports = {
    closeStan
}
