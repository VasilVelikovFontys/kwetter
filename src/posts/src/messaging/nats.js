const nats = require("node-nats-streaming");
const dotenv = require("dotenv");
dotenv.config();

const {
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_HOST,
    NATS_PORT,
    NATS_POST_CREATED_CHANNEL
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

const publishPostCreated = data => {
    stan.publish(NATS_POST_CREATED_CHANNEL, data);
}

const closeStan = () => {
    stan.close();
}

module.exports = {
    publishPostCreated,
    closeStan
}
