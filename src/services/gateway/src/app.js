const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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

    app.use(authRouter);
    app.use(accountsRouter);
    app.use(usersRouter);
    app.use(postsRouter);
    app.use(followingRouter);
    app.use(trendsRouter);
    app.use(picturesRouter);

    return app;
}

module.exports = createApp
