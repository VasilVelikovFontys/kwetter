const dotenv = require("dotenv");
dotenv.config();

const createApp = require("./app");
const createJwtUtils = require("./jwt")

const {
    PORT,
    CLIENT_URL,
    ACCOUNTS_SERVICE_URL,
    POSTS_SERVICE_URL,
    MENTIONING_POSTS_SERVICE_URL,
    FOLLOWING_SERVICE_URL,
    LIKES_SERVICE_URL,
    TIMELINE_SERVICE_URL,
    TRENDS_SERVICE_URL,
    TREND_POSTS_SERVICE_URL,
    PICTURES_SERVICE_URL,
    USERS_SERVICE_URL,
    DETAILS_SERVICE_URL,
    JWT_SECRET
} = process.env;

const serviceUrls = {
    accountsUrl: ACCOUNTS_SERVICE_URL,
    postsUrl: POSTS_SERVICE_URL,
    mentioningPostsUrl: MENTIONING_POSTS_SERVICE_URL,
    followingUrl: FOLLOWING_SERVICE_URL,
    likesUrl: LIKES_SERVICE_URL,
    timelineUrl: TIMELINE_SERVICE_URL,
    trendsUrl: TRENDS_SERVICE_URL,
    trendPostsUrl: TREND_POSTS_SERVICE_URL,
    picturesUrl: PICTURES_SERVICE_URL,
    usersUrl: USERS_SERVICE_URL,
    detailsUrl: DETAILS_SERVICE_URL
}

const allowedOrigin = CLIENT_URL;

const jwtUtils = createJwtUtils(JWT_SECRET);
const app = createApp(allowedOrigin, serviceUrls, jwtUtils);

app.listen(PORT || 4000, () => {
    console.log(`Listening on port ${PORT || 4000}`);
});
