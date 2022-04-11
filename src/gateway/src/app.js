const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const createAuthRouter = require('./routes/auth');
const createPostsRouter = require('./routes/posts');
const createUsersRouter = require('./routes/users');

const createApp = (allowedOrigin, serviceUrls, jwtUtils) => {
    const app = express();
    app.disable('x-powered-by');

    const corsOptions = {
        origin: allowedOrigin,
        optionSuccessStatus: 200
    };

    const {accountsUrl, postsUrl, mentioningPostsUrl} = serviceUrls;

    const authRouter = createAuthRouter(accountsUrl, jwtUtils);
    const postsRouter = createPostsRouter(postsUrl, mentioningPostsUrl, jwtUtils);
    const usersRouter = createUsersRouter(accountsUrl, jwtUtils);

    app.use(bodyParser.json());
    app.use(cors(corsOptions));

    app.use(authRouter);
    app.use(postsRouter);
    app.use(usersRouter);

    return app;
}

module.exports = createApp
