const nats = require("node-nats-streaming");

const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_HOST,
    NATS_PORT,
    NATS_DETAILS_ADDED_CHANNEL
} = process.env;

const stan = nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, {
    url: `${NATS_HOST}:${NATS_PORT}`
});

stan.on('connect', () => {
    console.log(`${NATS_CLIENT_ID} connected to NATS`);

    stan.on('close', () => {
        process.exit();
    });
});

const publishDetailsAdded = data => {
    stan.publish(NATS_DETAILS_ADDED_CHANNEL, data);
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    closeStan,
    publishDetailsAdded
}
