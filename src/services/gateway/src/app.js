const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const {
    ENVIRONMENT_PREFIX
} = process.env;

const createAuthRouter = require('./routes/auth');
const createPostsRouter = require('./routes/posts');
const createUsersRouter = require('./routes/users');
const createFollowingRouter = require('./routes/following');
const createTrendsRouter = require('./routes/trends');
const createPicturesRouter = require('./routes/pictures');
const createAccountsRouter = require('./routes/accounts');

const createApp = (allowedOrigin, serviceUrls, jwtUtils) => {
    const app = express();
    app.disable('x-powered-by');

    const corsOptions = {
        origin: allowedOrigin,
        optionSuccessStatus: 200
    };

    const {
        accountsUrl,
        postsUrl,
        mentioningPostsUrl,
        followingUrl,
        likesUrl,
        timelineUrl,
        trendsUrl,
        trendPostsUrl,
        picturesUrl,
        usersUrl,
        detailsUrl
    } = serviceUrls;

    const authRouter = createAuthRouter(accountsUrl, jwtUtils);
    const accountsRouter = createAccountsRouter(accountsUrl, jwtUtils);
    const usersRouter = createUsersRouter(usersUrl, detailsUrl, jwtUtils);
    const postsRouter = createPostsRouter(postsUrl, mentioningPostsUrl, trendPostsUrl, likesUrl, timelineUrl, jwtUtils);
    const followingRouter = createFollowingRouter(followingUrl, jwtUtils);
    const trendsRouter = createTrendsRouter(trendsUrl, jwtUtils);
    const picturesRouter = createPicturesRouter(picturesUrl, jwtUtils);

    app.use(bodyParser.json());
    app.use(cors(corsOptions));

    app.use(ENVIRONMENT_PREFIX, authRouter);
    app.use(ENVIRONMENT_PREFIX, accountsRouter);
    app.use(ENVIRONMENT_PREFIX, usersRouter);
    app.use(ENVIRONMENT_PREFIX, postsRouter);
    app.use(ENVIRONMENT_PREFIX, followingRouter);
    app.use(ENVIRONMENT_PREFIX, trendsRouter);
    app.use(ENVIRONMENT_PREFIX, picturesRouter);

    return app;
}

module.exports = createApp
