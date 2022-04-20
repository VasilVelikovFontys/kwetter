const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const createAuthRouter = require('./routes/auth');
const createPostsRouter = require('./routes/posts');
const createUsersRouter = require('./routes/users');
const createFollowingRouter = require('./routes/following');
const createTrendsRouter = require('./routes/trends');

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
        trendPostsUrl
    } = serviceUrls;

    const authRouter = createAuthRouter(accountsUrl, jwtUtils);
    const postsRouter = createPostsRouter(postsUrl, mentioningPostsUrl, trendPostsUrl, likesUrl, timelineUrl, jwtUtils);
    const usersRouter = createUsersRouter(accountsUrl, jwtUtils);
    const followingRouter = createFollowingRouter(followingUrl, jwtUtils);
    const trendsRouter = createTrendsRouter(trendsUrl, jwtUtils);

    app.use(bodyParser.json());
    app.use(cors(corsOptions));

    app.use(authRouter);
    app.use(postsRouter);
    app.use(usersRouter);
    app.use(followingRouter);
    app.use(trendsRouter);

    return app;
}

module.exports = createApp
