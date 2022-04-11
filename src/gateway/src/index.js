const dotenv = require("dotenv");
dotenv.config();

const createApp = require("./app");
const createJwtUtils = require("./jwt")

const {
    PORT,
    CLIENT_HOST,
    CLIENT_PORT,
    ACCOUNTS_SERVICE_HOST,
    ACCOUNTS_SERVICE_PORT,
    POSTS_SERVICE_HOST,
    POSTS_SERVICE_PORT,
    MENTIONING_POSTS_SERVICE_HOST,
    MENTIONING_POSTS_SERVICE_PORT,
    JWT_SECRET
} = process.env;

const serviceUrls = {
    accountsUrl: `${ACCOUNTS_SERVICE_HOST}:${ACCOUNTS_SERVICE_PORT}`,
    postsUrl: `${POSTS_SERVICE_HOST}:${POSTS_SERVICE_PORT}`,
    mentioningPostsUrl: `${MENTIONING_POSTS_SERVICE_HOST}:${MENTIONING_POSTS_SERVICE_PORT}`
}

const allowedOrigin = `${CLIENT_HOST}:${CLIENT_PORT}`;

const jwtUtils = createJwtUtils(JWT_SECRET);
const app = createApp(allowedOrigin, serviceUrls, jwtUtils);

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);
});
