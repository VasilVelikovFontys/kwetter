const express = require("express");

const createAuthRouter = (auth) => {
    const router = express.Router();

    router.post('/auth/register', async (req, res) => {
        const {email, password} = req.body;

        if (!email) return res.status(400).send({error: "Email is required!"});
        if (!password) return res.status(400).send({error: "Password is required!"});

        try {
            const uid = await auth.registerUser(email, password);

            res.status(201).send({uid});
        } catch (error) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    res.status(400).send({error: "Email already taken!"});
                    break;
                case "auth/weak-password":
                    res.status(400).send({error: "Password must be at least 6 characters!"});
                    break;
                default:
                    res.status(400).send({error});
                    break;
            }
        }
    });

    router.post('/auth/authenticate', async (req, res) => {
        const {email, password} = req.body;

        if (!email) return res.status(400).send({error: "Email is required!"});
        if (!password) return res.status(400).send({error: "Password is required!"});

        try {
            const uid = await auth.authenticateUser(email, password);

            res.status(200).send({uid});
        } catch (error) {
            res.status(400).send({error});
        }
    });

    return router;
}

module.exports = createAuthRouter;
