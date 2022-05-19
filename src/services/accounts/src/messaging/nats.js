const nats = require("node-nats-streaming");
const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_URL,
    NATS_ACCOUNT_CREATED_CHANNEL,
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
});

const publishAccountCreated = data => {
    stan.publish(NATS_ACCOUNT_CREATED_CHANNEL, data);
}

const publishAccountPromoted = data => {
    stan.publish(NATS_ACCOUNT_PROMOTED_CHANNEL, data);
}

const publishAccountDemoted = data => {
    stan.publish(NATS_ACCOUNT_DEMOTED_CHANNEL, data);
}

const publishAccountDeleted = data => {
    stan.publish(NATS_ACCOUNT_DELETED_CHANNEL, data);
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    publishAccountCreated,
    publishAccountPromoted,
    publishAccountDemoted,
    publishAccountDeleted,
    closeStan
}
